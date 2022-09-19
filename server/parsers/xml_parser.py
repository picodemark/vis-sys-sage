import copy
import logging
from datetime import datetime

import xmltodict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UNIQUE_COMPONENT_ID = "addr"

DATA_PATH_TYPES = {
    "32": "NONE",
    "64": "LOGICAL",
    "128": "PHYSICAL",
    "256": "L3CAT"
}


class XMLParser:
    def __init__(self, xml_string):
        self.xml = xml_string
        self.converted_dict = self.__get_dict_from_xml()
        self.components_dict = {}
        self.components_list = []
        self.nodes_list = []

    def get_data(self):
        data = {
            "tree": self.__get_component_tree(),
            "componentsList": self.components_list,
            "nodesList": self.nodes_list,
            "dataPath": self.__get_data_path_graph()
        }
        return data

    def __get_dict_from_xml(self):
        start_time_xml_to_dict = datetime.now()
        converted_dict = xmltodict.parse(self.xml)
        logger.info(
            "dt[xml_to_dict]: %s",
            (datetime.now() - start_time_xml_to_dict).total_seconds()
        )
        return converted_dict

    def __assign_component_info(self, component_dict, node_id):
        component_dict_obj = {
            "name": component_dict["name"],
            "nodeID": node_id,
            "componentID": component_dict["id"],
            "uniqueComponentID": component_dict["uniqueComponentID"]
        }
        if "attributes" in component_dict:
            component_dict_obj["attributes"] = component_dict["attributes"]

        self.components_dict[component_dict["uniqueComponentID"]] = component_dict_obj
        self.components_list.append(component_dict_obj)

    def __get_component_info(self, unique_component_id):
        if unique_component_id in self.components_dict:
            return self.components_dict[unique_component_id]
        return {}

    def __get_component_tree(self):
        sys_sage_dict = copy.deepcopy(self.converted_dict)

        tree_dict = sys_sage_dict["sys-sage"]["components"]["topology"]

        start_time_dict_to_d3_tree_graph = datetime.now()
        self.__get_component_tree_rec(tree_dict)
        logger.info(
            "dt[dict_to_d3_tree_graph]: %s",
            (datetime.now() - start_time_dict_to_d3_tree_graph).total_seconds()
        )

        return tree_dict

    def __get_component_tree_rec(self, component_dict, node_id=None):
        # copy for iterating
        copy_dict = copy.deepcopy(component_dict)

        # adapt tree node according to requirements of d3 tree graph
        for key, value in copy_dict.items():
            key_lower = key.lower()

            # set name
            if key_lower[1:] == "name":
                component_dict["name"] = value
            elif key_lower[1:] == UNIQUE_COMPONENT_ID:
                component_dict["uniqueComponentID"] = value
            elif key_lower[1:] == "id":
                component_dict["id"] = value
            # set attributes and node info
            elif key_lower[0] == "@":
                if "attributes" not in component_dict:
                    component_dict["attributes"] = {}
                component_dict["attributes"][key[1:]] = value
            # set further attributes
            elif key_lower == "attribute":
                if "attributes" not in component_dict:
                    component_dict["attributes"] = {}
                if isinstance(component_dict[key], list):
                    for attribute_obj in component_dict[key]:
                        component_dict["attributes"][attribute_obj["@name"]] = attribute_obj["@value"]
                else:
                    component_dict["attributes"][component_dict[key]["@name"]] = component_dict[key]["@value"]
            # set children
            elif isinstance(value, dict):
                if "children" in component_dict:
                    component_dict["children"].append(value)
                else:
                    component_dict["children"] = [value]
            elif isinstance(value, list):
                if "children" in component_dict:
                    component_dict["children"] += value
                else:
                    component_dict["children"] = value

            # delete key
            del component_dict[key]

        # fill components dict and list
        self.__assign_component_info(component_dict, node_id)

        # call recursive function for all children nodes
        if "children" in component_dict:
            for child in component_dict["children"]:
                # root
                if component_dict["name"] == "topology":
                    # the children of topology component are nodes
                    node_id = child["@id"]
                    self.nodes_list.append({
                        "id": child["@id"]
                    })
                self.__get_component_tree_rec(child, node_id)

    def __get_data_path_graph(self):
        sys_sage_dict = copy.deepcopy(self.converted_dict)

        data_paths = sys_sage_dict["sys-sage"]["data-paths"]["datapath"]

        start_time_get_data_path = datetime.now()

        components_per_node = {}

        links_per_node = {}

        link_attributes = {}

        for data_path in data_paths:
            source = data_path["@source"]
            node_id_source = self.components_dict[source]["nodeID"]

            if node_id_source not in components_per_node:
                components_per_node[node_id_source] = {}

            if source not in components_per_node[node_id_source]:
                components_per_node[node_id_source][source] = True

            del data_path["@source"]

            target = data_path["@target"]
            node_id_target = self.components_dict[target]["nodeID"]

            if node_id_target not in components_per_node:
                components_per_node[node_id_target] = {}

            if target not in components_per_node[node_id_target]:
                components_per_node[node_id_target][target] = True

            del data_path["@target"]

            if node_id_source not in links_per_node:
                links_per_node[node_id_source] = []

            if source not in link_attributes or target not in link_attributes[source]:
                links_per_node[node_id_source].append({
                    "source": source,
                    "target": target
                })

            if source not in link_attributes:
                link_attributes[source] = {}

            if target not in link_attributes[source]:
                link_attributes[source][target] = []

            attributes = {}
            for key, value in data_path.items():
                key_lower = key.lower()

                if key_lower[0] == "@":
                    if key_lower[1:] == "dp_type":
                        attributes["type"] = DATA_PATH_TYPES[value] if value in DATA_PATH_TYPES else "CUSTOM"
                    elif key_lower[1:] == "latency" or key_lower[1:] == "bw":
                        attributes[key[1:]] = value
                    else:
                        if "moreInfo" not in attributes:
                            attributes["moreInfo"] = []
                        attributes["moreInfo"].append({
                            "name": key[1:],
                            "value": value
                        })
                elif key_lower == "attribute":
                    if isinstance(data_path[key], list):
                        for attribute_obj in data_path[key]:
                            attributes[attribute_obj["@name"]] = attribute_obj["@value"]
                    else:
                        attributes[data_path[key]["@name"]] = data_path[key]["@value"]

            link_attributes[source][target].append(attributes)

        # adjust
        for node in components_per_node.keys():
            components_per_node[node] = [{
                "id": component,
                "info": self.__get_component_info(component)
            } for component in components_per_node[node].keys()]

        logger.info(
            "dt[xml_to_dict]: %s",
            (datetime.now() - start_time_get_data_path).total_seconds()
        )

        return {
            "nodes": components_per_node,
            "links": links_per_node,
            "attributes": link_attributes
        }

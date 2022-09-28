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


def get_data_path_type(data_path_type):
    return DATA_PATH_TYPES[
        data_path_type
    ] if data_path_type in DATA_PATH_TYPES else f"CUSTOM({data_path_type})"


class XMLParser:
    def __init__(self, xml_string):
        self.xml = xml_string
        self.converted_dict = self.__get_dict_from_xml()
        self.components_dict = {}
        self.component_list = []
        self.node_list = []

    def get_data(self):
        return {
            "tree": self.__get_component_tree(),
            "componentList": self.component_list,
            "componentsInfo": self.components_dict,
            "nodeList": self.node_list,
            "dataPath": self.__get_data_path_graph()
        }

    def __get_dict_from_xml(self):
        start_time_xml_to_dict = datetime.now()
        converted_dict = xmltodict.parse(self.xml)
        logger.info(
            "dt[__get_dict_from_xml]: %s",
            (datetime.now() - start_time_xml_to_dict).total_seconds()
        )
        return converted_dict

    def __assign_component_info(self, component_dict, node_id):
        """Assigns the component information to the components list and dict containing all components.

        :param component_dict: dictionary containing information for a component
        :param node_id: node ID of a component
        :return:
        """
        component_dict_obj = {
            "name": component_dict["name"],
            "nodeID": node_id,
            "componentID": component_dict["id"],
            "uniqueComponentID": component_dict["uniqueComponentID"]
        }
        if "attributes" in component_dict:
            component_dict_obj["attributes"] = component_dict["attributes"]
            component_dict_obj["attributesNumber"] = component_dict["attributesNumber"]

        # adjust components dict and list
        self.components_dict[component_dict["uniqueComponentID"]] = component_dict_obj
        self.component_list.append(component_dict_obj)

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
                    component_dict["attributes"] = []
                component_dict["attributes"].append({
                    "name": key[1:],
                    "value": value
                })
            # set further attributes
            elif key_lower == "attribute":
                if "attributes" not in component_dict:
                    component_dict["attributes"] = []
                if isinstance(component_dict[key], list):
                    for attribute_obj in component_dict[key]:
                        component_dict["attributes"].append({
                            "name": attribute_obj["@name"],
                            "value": attribute_obj["@value"]
                        })
                else:
                    component_dict["attributes"].append({
                        "name": component_dict[key]["@name"],
                        "value": component_dict[key]["@value"]
                    })
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

        # determine number of attributes
        component_dict["attributesNumber"] = len(
            component_dict["attributes"]
        ) if "attributes" in component_dict else 0

        # fill components dict and list
        self.__assign_component_info(component_dict, node_id)

        # call recursive function for all children nodes
        if "children" in component_dict:
            for child in component_dict["children"]:
                # root
                if component_dict["name"] == "topology":
                    # the children of topology component are nodes
                    node_id = child["@id"]
                    self.node_list.append({
                        "id": child["@id"]
                    })
                self.__get_component_tree_rec(child, node_id)

    def __get_data_path_graph(self):
        sys_sage_dict = copy.deepcopy(self.converted_dict)

        # get data-paths data from sys-sage dictionary
        data_paths = sys_sage_dict["sys-sage"]["data-paths"]["datapath"]

        # start time measuring for performance tracking
        start_time_get_data_path = datetime.now()

        # all data-path types
        data_path_types = []

        # all components for each node
        components_per_node = {}

        # all links for each node
        links_per_node = {}

        # attributes for each link
        link_attributes = {}

        # iterate over all given data-paths
        for data_path in data_paths:
            # determine the data-path type
            raw_data_path_type = data_path["@dp_type"]
            data_path_type = get_data_path_type(raw_data_path_type)
            data_path_types.append(data_path_type)

            # treat source and target component
            source = data_path["@source"]
            target = data_path["@target"]

            node_id_source = self.components_dict[source]["nodeID"]
            node_id_target = self.components_dict[target]["nodeID"]

            if node_id_source not in components_per_node:
                components_per_node[node_id_source] = {}
            if node_id_target not in components_per_node:
                components_per_node[node_id_target] = {}

            if data_path_type not in components_per_node[node_id_source]:
                components_per_node[node_id_source][data_path_type] = []
            if data_path_type not in components_per_node[node_id_target]:
                components_per_node[node_id_target][data_path_type] = []

            components_per_node[node_id_source][data_path_type].append(source)
            components_per_node[node_id_target][data_path_type].append(target)

            del data_path["@source"]
            del data_path["@target"]

            # add link between source and target component for each node
            if node_id_source not in links_per_node:
                links_per_node[node_id_source] = {}
                links_per_node[node_id_source][data_path_type] = []

            if source not in link_attributes or \
                    target not in link_attributes[source] or \
                    data_path_type not in links_per_node[node_id_source]:
                links_per_node[node_id_source][data_path_type].append({
                    "source": source,
                    "target": target,
                })

            if source not in link_attributes:
                link_attributes[source] = {}

            if target not in link_attributes[source]:
                link_attributes[source][target] = {
                    "attributes": [],
                    "attributeNames": [],
                }

            attributes = {}
            attribute_names = []

            for key, value in data_path.items():
                key_lower = key.lower()

                if key_lower[0] == "@":
                    attribute_names.append(key[1:])
                    if key_lower[1:] == "dp_type":
                        attributes[key[1:]] = DATA_PATH_TYPES[value] if value in DATA_PATH_TYPES else "CUSTOM"
                    else:
                        attributes[key[1:]] = value
                elif key_lower == "attribute":
                    if isinstance(data_path[key], list):
                        for attribute_obj in data_path[key]:
                            attribute_names.append(attribute_obj["@name"])
                            attributes[attribute_obj["@name"]] = attribute_obj["@value"]
                    else:
                        attribute_names.append(data_path[key]["@name"])
                        attributes[data_path[key]["@name"]] = data_path[key]["@value"]

            # add attributes and attribute names for each link
            link_attributes[source][target]["attributes"].append(attributes)
            link_attributes[source][target]["attributeNames"] += attribute_names

            # make list unique
            link_attributes[source][target]["attributeNames"] = list(
                set(link_attributes[source][target]["attributeNames"])
            )

        # make all components for each node unique
        for node in components_per_node.keys():
            for dp_type in components_per_node[node].keys():
                components_per_node[node][dp_type] = list(set(components_per_node[node][dp_type]))
                components_per_node[node][dp_type] = [{"id": node} for node in components_per_node[node][dp_type]]

        # make all data-path types unique
        data_path_types = list(set(data_path_types))
        data_path_types = [{"name": dp_type} for dp_type in data_path_types]

        # logging the measured time for performance tracking
        logger.info(
            "dt[__get_data_path_graph]: %s",
            (datetime.now() - start_time_get_data_path).total_seconds()
        )

        return {
            "types": data_path_types,
            "nodes": components_per_node,
            "links": links_per_node,
            "attributes": link_attributes,
        }

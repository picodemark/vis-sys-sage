import copy
import logging
from datetime import datetime

import xmltodict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class XMLParser:

    def __init__(self, xml_string):
        self.xml = xml_string
        self.converted_dict = self.__get_dict_from_xml()
        self.unique_component_id = "addr"
        self.components_dict = {}
        self.components_list = []
        self.nodes_list = []
        self.data_path_nodes = []

    def get_data(self):
        data = {
            "tree": self.__get_component_tree(),
            "components_dict": self.components_dict,
            "components_list": self.components_list,
            "nodes_list": self.nodes_list,
            "data_path": self.__get_data_path_graph()
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
            "node_id": node_id,
            "component_id": component_dict["id"],
            "unique_component_id": component_dict["unique_component_id"]
        }
        if "attributes" in component_dict:
            component_dict_obj["attributes"] = component_dict["attributes"]

        self.components_dict[component_dict["unique_component_id"]] = component_dict
        self.components_list += [component_dict_obj]

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
            elif key_lower[1:] == self.unique_component_id:
                component_dict["unique_component_id"] = value
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
                    component_dict["children"] += [value]
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
                    # the children of the topology are nodes
                    node_id = child["@id"]
                    self.nodes_list += [{
                        "id": child["@id"]
                    }]
                self.__get_component_tree_rec(child, node_id)

    def __get_data_path_graph(self):
        sys_sage_dict = copy.deepcopy(self.converted_dict)

        data_path_dict = sys_sage_dict["sys-sage"]["data-paths"]["datapath"]

        start_time_get_data_path = datetime.now()

        unique_data_path_nodes = {}

        for data_path in data_path_dict:
            copy_dict = copy.deepcopy(data_path)

            for key, value in copy_dict.items():
                key_lower = key.lower()

                if key_lower[1:] == "source" or key_lower[1:] == "target":
                    unique_data_path_nodes[data_path[key]] = True

                if key_lower[0] == "@":
                    data_path[key[1:]] = data_path[key]
                elif key_lower == "attribute":
                    if isinstance(data_path[key], list):
                        for attribute_obj in data_path[key]:
                            data_path[attribute_obj["@name"]] = attribute_obj["@value"]
                    else:
                        data_path[data_path[key]["@name"]] = data_path[key]["@value"]

                # delete key
                del data_path[key]

        data_path_nodes = [{"id": unique_id} for unique_id in unique_data_path_nodes.keys()]

        logger.info(
            "dt[xml_to_dict]: %s",
            (datetime.now() - start_time_get_data_path).total_seconds()
        )

        return {
            "nodes": data_path_nodes,
            "links": data_path_dict
        }

import copy
import os

import xmltodict

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))


class XMLParser:

    def __init__(self, xml_string):
        self.xml = xml_string
        self.attributes_black_list = ["id"]

    def __load_xml_from_file(self):
        with open(os.path.join(__location__, 'test_data/sys-sage_custom_attributes.xml')) as xml_file:
            self.xml = xml_file.read()

    def __get_dict(self):
        return xmltodict.parse(self.xml)

    def get_d3_tree_graph(self):
        converted_dict = copy.deepcopy(self.__get_dict())
        converted_dict = converted_dict['sys-sage']['components']['topology']
        self.__dict_to_d3_tree_graph_rec(converted_dict)
        return converted_dict

    def get_compound_dict(self):
        pass

    def __dict_to_d3_tree_graph_rec(self, tree_dict):
        if isinstance(tree_dict, list):
            for tree_dict_elem in tree_dict:
                self.__node_dict_to_d3_tree_graph_rec(tree_dict_elem)
        else:
            self.__node_dict_to_d3_tree_graph_rec(tree_dict)

    def __node_dict_to_d3_tree_graph_rec(self, node_dict):
        # copy for iterating
        copy_dict = copy.deepcopy(node_dict)

        # adapt tree node according to requirements of d3 tree graph
        for key, value in copy_dict.items():
            # set name
            if key == "@name":
                node_dict['name'] = value
            # set attributes and node info
            elif key[0] == "@":
                if "attributes" not in node_dict:
                    node_dict["attributes"] = {}
                if "info" not in node_dict:
                    node_dict["info"] = {}
                if key[1:] not in self.attributes_black_list:
                    node_dict["attributes"][key[1:]] = value
                else:
                    node_dict["info"][key[1:]] = value
            # set children
            elif isinstance(value, dict):
                if "children" in node_dict:
                    node_dict["children"] = node_dict["children"] + [value]
                else:
                    node_dict["children"] = [value]
            elif isinstance(value, list):
                if "children" in node_dict:
                    node_dict["children"] = node_dict["children"] + value
                else:
                    node_dict["children"] = value
            # delete key
            del node_dict[key]

        # call recursive function for all children nodes
        if "children" in node_dict:
            for child in node_dict["children"]:
                self.__dict_to_d3_tree_graph_rec(child)

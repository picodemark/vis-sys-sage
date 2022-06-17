import copy
import os

import xmltodict

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))


class XMLParser:

    def __init__(self):
        self.xml = None
        self.__load_xml_from_file()

    def __load_xml_from_file(self):
        with open(os.path.join(__location__, 'test_data/base_example.xml')) as xml_file:
            self.xml = xml_file.read()

    def __get_dict(self):
        return xmltodict.parse(self.xml)

    def get_d3_tree_graph(self):
        converted_dict = copy.deepcopy(self.__get_dict())
        converted_dict = converted_dict['sys-sage']['components']['Topology']
        dict_to_d3_tree_graph_rec(converted_dict)
        return converted_dict


def dict_to_d3_tree_graph_rec(tree_dict):
    if isinstance(tree_dict, list):
        for tree_dict_elem in tree_dict:
            node_dict_to_d3_tree_graph_rec(tree_dict_elem)
    else:
        node_dict_to_d3_tree_graph_rec(tree_dict)


def node_dict_to_d3_tree_graph_rec(node_dict):
    # copy for iterating
    copy_dict = copy.deepcopy(node_dict)

    # adapt tree node according to requirements of d3 tree graph
    for key, value in copy_dict.items():
        # set name
        if key == "@name":
            node_dict['name'] = value
        # set attributes
        elif key[0] == "@":
            if "attributes" not in node_dict:
                node_dict["attributes"] = {}
            node_dict["attributes"][key[1:]] = value
        # set children
        elif isinstance(value, dict):
            node_dict["children"] = [value]
        elif isinstance(value, list):
            node_dict["children"] = value
        # delete key
        del node_dict[key]

    # call recursive function for all children nodes
    if 'children' in node_dict:
        for child in node_dict["children"]:
            dict_to_d3_tree_graph_rec(child)

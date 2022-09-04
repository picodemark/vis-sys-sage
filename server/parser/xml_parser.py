import copy
import os
from datetime import datetime

import xmltodict

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))


class XMLParser:

    def __init__(self, xml_string):
        """

        :param xml_string: XML string to be parsed
        """
        self.xml = xml_string
        # attributes not being included
        self.attributes_black_list = ["addr"]

    def __load_xml_from_file(self):
        with open(os.path.join(__location__, "test_data/sys-sage_custom_attributes.xml")) as xml_file:
            self.xml = xml_file.read()

    def __get_dict(self):
        return xmltodict.parse(self.xml)

    def get_d3_tree_graph(self):
        converted_dict = copy.deepcopy(self.__get_dict())
        converted_dict = converted_dict['sys-sage']['components']['topology']
        start_time = datetime.now()
        self.__dict_to_d3_tree_graph_rec(converted_dict)
        print((datetime.now() - start_time).total_seconds())
        return converted_dict

    def get_relevant_data(self):
        data = {'tree': self.get_d3_tree_graph()}
        data['nodes'] = [node['attributes']['addr'] for node in data['tree']['children']]
        return data

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
                node_dict["name"] = value
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
            # set further attributes
            elif key == "Attribute":
                if "attributes" not in node_dict:
                    node_dict["attributes"] = {}
                if isinstance(node_dict["Attribute"], list):
                    for attribute_obj in node_dict["Attribute"]:
                        node_dict["attributes"][attribute_obj["@name"]] = attribute_obj["@value"]
                else:
                    node_dict["attributes"][node_dict["Attribute"]["@name"]] = node_dict["Attribute"]["@value"]
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

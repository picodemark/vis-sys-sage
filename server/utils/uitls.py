import os

# TODO: only for testing purposes; delete later on
__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))


def get_test_json():
    with open(os.path.join(__location__, 'test_data/flare.json')) as json_file:
        return json_file.read()

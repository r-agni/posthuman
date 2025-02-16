import json
from elasticsearch import Elasticsearch

ELASTICSEARCH_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="

# Connect to Elasticsearch
es = Elasticsearch(ELASTICSEARCH_URL, api_key=API_KEY)

# Retrieve the index mapping
mapping_response = es.indices.get_mapping(index="posthuman")

# Convert the response to a dictionary
mapping_dict = mapping_response.body if hasattr(mapping_response, "body") else mapping_response

# Pretty-print the mapping
print(json.dumps(mapping_dict, indent=2))

import re

PATTERNS = [
     r'router\.get',
    r'router\.post',
    r'router\.put',
    r'router\.delete',

    r'@Get',
    r'@Post',
    r'@Put',
    r'@Delete',

    r'@app\.get',
    r'@app\.post'
]

def find_api(content):
    apis = []

    for pattern in PATTERNS:
        matches = re.findall(
            pattern,
            content
        )
        
        apis.extend(matches)

    return apis
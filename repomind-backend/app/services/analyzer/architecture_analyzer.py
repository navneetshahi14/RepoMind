def analyze_architecture(
    document
):
    architecture = {
        "controller":[],
        "service":[],
        "models":[],
        "repositories":[]
    }
    
    for doc in document:
        path = doc["path"]
        
        if "controller" in path:
            architecture["controller"].append(path)
        
        elif "service" in path:
            architecture["service"].append(path)
        elif "model" in path:
            architecture["models"].append(path)
            
    return architecture
            
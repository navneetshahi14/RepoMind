from enum import Enum

class SourceType(str, Enum):
    GITHUB = "GITHUB"
    PDF = "PDF"

class SourceStatus(str,Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class FileType(str, Enum):
    FILE = "FILE"
    DIRECTORY = "DIRECTORY"

class MessageRole(str,Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"
    SYSTEM = "SYSTEM"
    
class ProjectStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"
    
class JobStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


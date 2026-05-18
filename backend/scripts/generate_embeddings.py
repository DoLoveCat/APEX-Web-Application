import voyageai
from dotenv import load_dotenv
import json
import os
import time

load_dotenv()
client = voyageai.Client(api_key=os.getenv("VOYAGE_API_KEY"))

with open("courses.json", "r", encoding="utf-8") as f:
    courses = json.load(f)

embeddedCourses = []

for course in courses:
    combinedText = f'''
    {course["subject"]} {course["courseNumber"]}
    {course["title"]}
    {course["description"]}
    '''

    result = client.embed([combinedText], model="voyage-3")
    course["embedding"] = result.embeddings[0]

    embeddedCourses.append(course)

    print(f'Embedded {course["subject"]} {course["courseNumber"]}')
    time.sleep(0.5)

with open("embedded-courses.json", "w", encoding="utf-8") as f:
    json.dump(embeddedCourses, f)

print("Saved embedded-courses.json")
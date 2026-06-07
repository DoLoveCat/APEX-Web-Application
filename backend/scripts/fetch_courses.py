import time
import requests
from requests import request
from requests.cookies import RequestsCookieJar
from bs4 import BeautifulSoup
import json
import os

def get_session(term):
    JSESSIONID = requests.get("https://registrationssb.ucr.edu").cookies["JSESSIONID"]

    headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}

    r = request("POST",
                "https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/term/search?mode=search", 
                data={"term": term},
                headers=headers
    )

    jar = RequestsCookieJar()
    jar.update(r.cookies)

    return headers, jar


def get_total_count (term, headers, jar):
    pageOffset = 0
    pageMaxSize = 500

    url = f"https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?&txt_term={term}&pageOffset={pageOffset}&pageMaxSize={pageMaxSize}&sortColumn=subjectDescription&sortDirection=asc"
    response = request("GET", url, headers=headers, cookies=jar)
    totalCount = response.json()["totalCount"]

    return totalCount


def fetch_all_sections(term, headers, jar, totalCount):
    pageMaxSize = 500  # max request size
    courses = []
    pageOffset = 0

    while True:
        print(len(courses))
        url = f"https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?&txt_term={term}&startDatepicker=&endDatepicker=&pageOffset={pageOffset}&pageMaxSize={pageMaxSize}&sortColumn=subjectDescription&sortDirection=asc"

        response = request("GET", url, headers=headers, cookies=jar)
        response.raise_for_status()
        new_courses = response.json()["data"]
        
        if not new_courses:
            print("No more courses available.")
            break
        
        courses.extend(new_courses)
        
        if len(new_courses) < pageMaxSize:
            print("Fetched all available data.")
            break
        
        pageOffset += pageMaxSize #getting next 500 sections
        
        if len(courses) >= totalCount:
            break

    return courses


def deduplicate(courses):
    uniqueCourses = {}

    for course in courses:
        key = (course.get("subject"), course.get("courseNumber"))

        if key not in uniqueCourses:
            uniqueCourses[key] = course

    return uniqueCourses


def fetch_course_description(course, term, headers, jar):
    try:
        response = requests.post(
              "https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/searchResults/getCourseDescription", 
              headers=headers, 
              cookies=jar,
              data={"term": term, "courseReferenceNumber": course["courseReferenceNumber"]})
        
        response.raise_for_status()
        return response
    
    except Exception as e:
        print(f"Error fetching description: {e}")
        return ""
    

def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text(separator=" ", strip=True)

def run(term="202640"):

    headers, jar = get_session(term)
    totalCount = get_total_count(term, headers, jar)

    allSections = fetch_all_sections(term, headers, jar, totalCount)
    uniqueCourses = deduplicate(allSections)

    cleanCourses = []

    for key in uniqueCourses:
        course = uniqueCourses[key]

        response = fetch_course_description(course, term, headers, jar)
        rawDescription = response.text if response else ""
        cleanDescription = parse_html(rawDescription)

        cleanCourses.append(
            {
                "subject": course.get("subject"),
                "courseNumber": course.get("courseNumber"),
                "title": course.get("courseTitle"),
                "description": cleanDescription,
                "rawDescription": rawDescription,
                "term": term,
                "crn": course.get("courseReferenceNumber"),
            }
        )
        
        print(f"Processing: {course.get('subject')} {course.get('courseNumber')}")

        time.sleep(0.5)

    if os.path.exists("courses.json"):
        with open("courses.json", "r", encoding="utf-8") as f:
            existingCourses = json.load(f)
    else:
        existingCourses = []

    combined = existingCourses + cleanCourses
    uniqueCombined = deduplicate(combined)

    uniqueCoursesSorted = sorted(
        uniqueCombined.values(),
        key=lambda c: (c.get("subject", ""), c.get("courseNumber", ""))
    )
    
    with open("courses.json", "w", encoding="utf-8") as f: json.dump(uniqueCoursesSorted, f, indent=2)

    print("Saved courses.json")
    print(f"Total unique courses: {len(uniqueCombined)}")

if __name__ == "__main__":
    run(term="202640")
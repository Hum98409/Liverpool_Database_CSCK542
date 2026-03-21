#!/usr/bin/env python3
import json
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8000"
ENDPOINTS = [
    "/health",
    "/students",
    "/departments",
    "/programs",
    "/lecturers",
    "/courses",
    "/course-offerings",
    "/semesters",
    "/research-projects",
    "/research-projects/1/members",
    "/non-academic-staff",
    "/student-employments",
    "/lookups/students",
    "/lookups/lecturers",
    "/lookups/course-offerings",
    "/lookups/semesters",
    "/lookups/departments",
    "/lookups/programs",
    "/queries/students-by-course-and-lecturer?courseOfferingId=1",
    "/queries/final-year-top-students",
    "/queries/unregistered-current-semester?semesterId=1",
    "/queries/student-advisor-contact?studentId=1",
    "/queries/lecturers-by-research-area?keyword=ai",
    "/queries/courses-by-department?departmentId=1",
    "/queries/top-project-supervisors?limit=5",
    "/queries/students-by-advisor?lecturerId=1",
    "/queries/staff-by-department?departmentId=1",
    "/queries/program-student-employee-supervisors?programId=1",
    "/reports/lecturer-publications?year=2025",
    "/dashboard/summary",
]


def fetch(path):
    url = BASE + path
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            text = resp.read().decode('utf-8')
            try:
                data = json.loads(text)
            except Exception:
                data = text
            return status, data
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8')
            data = json.loads(body)
        except Exception:
            data = e.reason
        return e.code, data
    except Exception as e:
        return None, str(e)


if __name__ == '__main__':
    results = {}
    for ep in ENDPOINTS:
        print('\n==>', ep)
        status, data = fetch(ep)
        print('status:', status)
        if status == 200 and isinstance(data, list):
            print('sample:', json.dumps(data[:3], indent=2, ensure_ascii=False))
        else:
            print('body:', json.dumps(data, indent=2, ensure_ascii=False) if not isinstance(data, str) else data)
        results[ep] = {'status': status, 'sample': data if (status==200) else data}

    # write a compact report
    with open('/tmp/smoke_test_report.json', 'w') as f:
        json.dump(results, f, indent=2)
    print('\nReport written to /tmp/smoke_test_report.json')

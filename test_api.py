#!/usr/bin/env python3
"""
Simple test script to verify Django API functionality
Run this script to test the form saving API endpoints
"""

import json
import requests
import sys

# Test data
test_form_data = {
    "name": "Test Form",
    "schema": {
        "components": [
            {
                "key": "firstName",
                "label": "First Name",
                "type": "textfield",
                "input": True,
                "validate": {
                    "required": True
                }
            },
            {
                "key": "lastName",
                "label": "Last Name",
                "type": "textfield",
                "input": True,
                "validate": {
                    "required": True
                }
            },
            {
                "key": "email",
                "label": "Email",
                "type": "email",
                "input": True,
                "validate": {
                    "required": True
                }
            }
        ]
    }
}

def test_api_endpoints():
    """Test the Django API endpoints"""
    base_url = "http://localhost:8000/formbuilder/api"

    print("Testing Django Form Builder API...")
    print("=" * 50)

    # Test 1: Create a new form
    print("1. Testing form creation...")
    try:
        response = requests.post(
            f"{base_url}/forms/",
            json=test_form_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            form_data = response.json()
            form_id = form_data["id"]
            print(f"✅ Form created successfully! ID: {form_id}")
            print(f"   Form name: {form_data['name']}")
            print(f"   Created at: {form_data['created_at']}")
        else:
            print(f"❌ Form creation failed. Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure Django server is running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    # Test 2: Get all forms
    print("\n2. Testing get all forms...")
    try:
        response = requests.get(f"{base_url}/forms/")

        if response.status_code == 200:
            forms_data = response.json()
            print(f"✅ Retrieved {len(forms_data['forms'])} forms")
            for form in forms_data['forms']:
                print(f"   - {form['name']} (ID: {form['id']})")
        else:
            print(f"❌ Get forms failed. Status: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    # Test 3: Get specific form
    print(f"\n3. Testing get specific form (ID: {form_id})...")
    try:
        response = requests.get(f"{base_url}/forms/{form_id}/")

        if response.status_code == 200:
            form_data = response.json()
            print(f"✅ Retrieved form: {form_data['name']}")
            print(f"   Schema components: {len(form_data['schema']['components'])}")
        else:
            print(f"❌ Get specific form failed. Status: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    # Test 4: Update form
    print(f"\n4. Testing form update (ID: {form_id})...")
    try:
        update_data = {
            "name": "Updated Test Form",
            "schema": test_form_data["schema"]
        }

        response = requests.put(
            f"{base_url}/forms/{form_id}/",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            form_data = response.json()
            print(f"✅ Form updated successfully!")
            print(f"   New name: {form_data['name']}")
        else:
            print(f"❌ Form update failed. Status: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    # Test 5: Create form submission
    print(f"\n5. Testing form submission creation...")
    try:
        submission_data = {
            "form_id": form_id,
            "data": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com"
            }
        }

        response = requests.post(
            f"{base_url}/submissions/",
            json=submission_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            submission = response.json()
            print(f"✅ Submission created successfully! ID: {submission['id']}")
            print(f"   Form: {submission['form_name']}")
            print(f"   Submitted at: {submission['submitted_at']}")
        else:
            print(f"❌ Submission creation failed. Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    # Test 6: Get form submissions
    print(f"\n6. Testing get form submissions...")
    try:
        response = requests.get(f"{base_url}/forms/{form_id}/submissions/")

        if response.status_code == 200:
            submissions_data = response.json()
            print(f"✅ Retrieved {len(submissions_data['submissions'])} submissions")
            for submission in submissions_data['submissions']:
                print(f"   - Submission {submission['id']} at {submission['submitted_at']}")
        else:
            print(f"❌ Get submissions failed. Status: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    print("\n" + "=" * 50)
    print("🎉 All tests passed! The Django API is working correctly.")
    return True

if __name__ == "__main__":
    success = test_api_endpoints()
    sys.exit(0 if success else 1)

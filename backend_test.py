#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for IndianDuo
Tests all major endpoints with realistic Indian language data
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8001"
API_BASE = f"{BASE_URL}/api"

# Test data with realistic Indian names and languages
TEST_USER_DATA = {
    "username": "priya_sharma",
    "email": "priya.sharma@gmail.com", 
    "password": "SecurePass123!",
    "native_language": "Hindi",
    "learning_language": "Tamil"
}

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        })
        
    def test_health_check(self):
        """Test GET /api/health endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/health")
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Check", True, "Backend is healthy", data)
                    return True
                else:
                    self.log_test("Health Check", False, f"Invalid health response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_languages_endpoint(self):
        """Test GET /api/languages endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/languages")
            
            if response.status_code == 200:
                languages = response.json()
                
                if not isinstance(languages, list):
                    self.log_test("Languages Endpoint", False, "Response is not a list")
                    return False
                    
                if len(languages) == 0:
                    self.log_test("Languages Endpoint", False, "No languages returned")
                    return False
                
                # Check for expected Indian languages
                language_names = [lang.get("name", "") for lang in languages]
                expected_languages = ["Hindi", "Tamil", "Telugu", "Bengali", "Kannada", "Marathi"]
                
                found_languages = [lang for lang in expected_languages if lang in language_names]
                
                if len(found_languages) >= 4:  # At least 4 Indian languages
                    self.log_test("Languages Endpoint", True, 
                                f"Found {len(languages)} languages including: {', '.join(found_languages)}")
                    return True
                else:
                    self.log_test("Languages Endpoint", False, 
                                f"Missing expected Indian languages. Found: {language_names}")
                    return False
                    
            else:
                self.log_test("Languages Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Languages Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test POST /api/auth/register endpoint"""
        try:
            response = self.session.post(
                f"{API_BASE}/auth/register",
                json=TEST_USER_DATA,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "access_token" in data and "token_type" in data:
                    self.access_token = data["access_token"]
                    self.log_test("User Registration", True, 
                                f"User registered successfully. Token type: {data['token_type']}")
                    return True
                else:
                    self.log_test("User Registration", False, f"Invalid response format: {data}")
                    return False
                    
            elif response.status_code == 400:
                # User might already exist, try with different username
                modified_data = TEST_USER_DATA.copy()
                modified_data["username"] = f"test_user_{int(time.time())}"
                modified_data["email"] = f"test_{int(time.time())}@example.com"
                
                response = self.session.post(
                    f"{API_BASE}/auth/register",
                    json=modified_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self.access_token = data["access_token"]
                    self.log_test("User Registration", True, 
                                "User registered with modified credentials")
                    return True
                else:
                    self.log_test("User Registration", False, 
                                f"Failed even with modified data: HTTP {response.status_code}")
                    return False
            else:
                self.log_test("User Registration", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test POST /api/auth/login endpoint"""
        try:
            # Use form data for OAuth2PasswordRequestForm
            login_data = {
                "username": TEST_USER_DATA["username"],
                "password": TEST_USER_DATA["password"]
            }
            
            response = self.session.post(
                f"{API_BASE}/auth/login",
                data=login_data,  # Use data instead of json for form data
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "access_token" in data and "token_type" in data:
                    self.access_token = data["access_token"]
                    self.log_test("User Login", True, "Login successful")
                    return True
                else:
                    self.log_test("User Login", False, f"Invalid response format: {data}")
                    return False
                    
            elif response.status_code == 401:
                self.log_test("User Login", False, "Invalid credentials - this is expected if registration used modified data")
                return False
            else:
                self.log_test("User Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Error: {str(e)}")
            return False
    
    def test_protected_profile(self):
        """Test GET /api/user/profile with authentication"""
        if not self.access_token:
            self.log_test("Protected Profile", False, "No access token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.get(f"{API_BASE}/user/profile", headers=headers)
            
            if response.status_code == 200:
                profile = response.json()
                
                # Check if profile contains expected fields
                expected_fields = ["username", "email", "native_language", "learning_language"]
                missing_fields = [field for field in expected_fields if field not in profile]
                
                if not missing_fields:
                    self.log_test("Protected Profile", True, 
                                f"Profile retrieved successfully for user: {profile.get('username')}")
                    return True
                else:
                    self.log_test("Protected Profile", False, 
                                f"Missing profile fields: {missing_fields}")
                    return False
                    
            elif response.status_code == 401:
                self.log_test("Protected Profile", False, "Authentication failed - invalid token")
                return False
            else:
                self.log_test("Protected Profile", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Protected Profile", False, f"Error: {str(e)}")
            return False
    
    def test_lesson_completion(self):
        """Test POST /api/lessons/{lesson_id}/complete with authentication"""
        if not self.access_token:
            self.log_test("Lesson Completion", False, "No access token available")
            return False
            
        try:
            # Use a dummy lesson ID for testing
            lesson_id = "test-lesson-123"
            score = 85
            
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.post(
                f"{API_BASE}/lessons/{lesson_id}/complete",
                params={"score": score},
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "message" in data:
                    self.log_test("Lesson Completion", True, 
                                f"Lesson completion recorded: {data['message']}")
                    return True
                else:
                    self.log_test("Lesson Completion", False, f"Invalid response format: {data}")
                    return False
                    
            elif response.status_code == 401:
                self.log_test("Lesson Completion", False, "Authentication failed")
                return False
            else:
                self.log_test("Lesson Completion", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Lesson Completion", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("🚀 Starting IndianDuo Backend API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            ("Health Check", self.test_health_check),
            ("Languages Endpoint", self.test_languages_endpoint),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("Protected Profile", self.test_protected_profile),
            ("Lesson Completion", self.test_lesson_completion)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running {test_name}...")
            if test_func():
                passed += 1
            time.sleep(0.5)  # Small delay between tests
        
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
        
        return passed == total
    
    def get_summary(self):
        """Get a summary of all test results"""
        return {
            "total_tests": len(self.test_results),
            "passed": len([r for r in self.test_results if r["success"]]),
            "failed": len([r for r in self.test_results if not r["success"]]),
            "results": self.test_results
        }

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    summary = tester.get_summary()
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
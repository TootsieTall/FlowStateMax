#!/bin/bash

# Test script to verify redirect loop fix
# This tests that /login properly redirects to /onboarding without creating a loop

echo "=================================="
echo "Testing Redirect Loop Fix"
echo "=================================="
echo ""

BASE_URL="http://localhost:3001"

echo "TEST 1: /login should redirect to /onboarding (307)"
echo "---------------------------------------------------"
RESPONSE=$(curl -s -I "${BASE_URL}/login" 2>&1)
echo "$RESPONSE" | grep -E "HTTP|Location" | head -3
echo ""

if echo "$RESPONSE" | grep -q "Location: /onboarding"; then
    echo "✅ PASS: /login redirects to /onboarding"
else
    echo "❌ FAIL: /login does not redirect correctly"
fi
echo ""

echo "TEST 2: /onboarding should load (200 OK)"
echo "---------------------------------------------------"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/onboarding")
echo "HTTP Status: $STATUS"
echo ""

if [ "$STATUS" = "200" ]; then
    echo "✅ PASS: /onboarding loads successfully"
else
    echo "❌ FAIL: /onboarding returned status $STATUS"
fi
echo ""

echo "TEST 3: Follow redirect chain (should be 1 redirect only)"
echo "---------------------------------------------------"
REDIRECT_INFO=$(curl -s -L -o /dev/null -w "Final URL: %{url_effective}\nHTTP Code: %{http_code}\nNum Redirects: %{num_redirects}\n" "${BASE_URL}/login")
echo "$REDIRECT_INFO"
echo ""

NUM_REDIRECTS=$(echo "$REDIRECT_INFO" | grep "Num Redirects" | awk '{print $3}')
if [ "$NUM_REDIRECTS" = "1" ]; then
    echo "✅ PASS: Only 1 redirect (no loop)"
else
    echo "❌ FAIL: $NUM_REDIRECTS redirects detected (possible loop)"
fi
echo ""

echo "TEST 4: Check if /onboarding content contains login form"
echo "---------------------------------------------------"
CONTENT=$(curl -s "${BASE_URL}/onboarding")
if echo "$CONTENT" | grep -qi "email\|password\|sign"; then
    echo "✅ PASS: Onboarding page contains form elements"
else
    echo "❌ FAIL: No form elements found"
fi
echo ""

echo "=================================="
echo "Test Summary"
echo "=================================="
echo "If all tests pass, the redirect loop is fixed!"
echo ""

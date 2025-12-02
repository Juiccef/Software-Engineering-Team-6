<!-- c536a2f7-9072-4ab9-983c-ebcae9fb7b0a 9f84a2b2-fcb2-4811-a5f1-56d6a1fad6ea -->
# Schedule Planning Improvements

## Issues to Fix
1. Semester detection returns current semester instead of next semester (showing "Fall 2025" when it should be "Spring 2026")
2. No year level collection - chatbot doesn't know if student is freshman/sophomore/junior/senior
3. When transcript is missing or fails, chatbot recommends intro courses to everyone (inappropriate for upperclassmen)

## Implementation Plan

### 1. Fix Semester Detection
- **File**: `Backend/api_integration/scheduleGenerator.js`
- Create `getNextSemester()` function that returns the next upcoming semester
- Update `getCurrentSemester()` logic: if in Dec 2025, next semester is Spring 2026
- Replace `getCurrentSemester()` calls in schedule generation with `getNextSemester()`
- Also update `Backend/api_integration/scheduleExporter.js` to use `getNextSemester()` for schedule exports

### 2. Add Year Level Collection State
- **File**: `Backend/api_integration/schedulePlanningPipeline.js`
- Add `COLLECTING_YEAR_LEVEL` state between `COLLECTING_WORKLOAD` and `COLLECTING_TRANSCRIPT`
- Add year level parsing function to extract: freshman, sophomore, junior, senior (case-insensitive)
- Update `getNextQuestion()` to include year level question
- Store year level in pipeline state data

### 3. Update Pipeline Flow
- **File**: `Backend/api_integration/chatRoutes.js`
- After `COLLECTING_WORKLOAD` state, transition to `COLLECTING_YEAR_LEVEL` instead of `COLLECTING_TRANSCRIPT`
- After `COLLECTING_YEAR_LEVEL` state, transition to `COLLECTING_TRANSCRIPT`
- Pass year level to schedule generation function

### 4. Enhance Schedule Generation with Year Level
- **File**: `Backend/api_integration/scheduleGenerator.js`
- Add `yearLevel` parameter to `generateSchedule()` function
- Update prompt to include year level information
- When transcript is empty or parsing fails:
  - Use year level to suggest appropriate courses:
    - Freshman: Intro courses (CSC 1301, MATH 1111, ENGL 1101, etc.)
    - Sophomore: Lower-division major courses (CSC 2720, MATH 2212, etc.)
    - Junior: Upper-division major courses (CSC 3210, CSC 4350, etc.)
    - Senior: Advanced/capstone courses (CSC 4990, senior electives, etc.)
- Include year level context in the AI prompt for better course recommendations

### 5. Update Schedule Display
- **File**: `Backend/api_integration/scheduleGenerator.js`
- Include year level in schedule data structure (optional, for display)
- Ensure semester field uses next semester

## Files to Modify
1. `Backend/api_integration/scheduleGenerator.js` - Add `getNextSemester()`, update `generateSchedule()` to accept and use year level
2. `Backend/api_integration/schedulePlanningPipeline.js` - Add `COLLECTING_YEAR_LEVEL` state and parsing logic
3. `Backend/api_integration/chatRoutes.js` - Update pipeline flow to include year level collection
4. `Backend/api_integration/scheduleExporter.js` - Update to use `getNextSemester()`

## Expected Behavior
- Pipeline flow: Major → Workload → **Year Level** → Transcript → Schedule Generation
- Semester shows "Spring 2026" (or appropriate next semester) instead of current semester
- When transcript is missing/fails: Freshman gets intro courses, Senior gets advanced courses
- Year level guides course recommendations even when transcript is available

### To-dos

- [ ] Create getNextSemester() function and update schedule generation to use next semester instead of current
- [ ] Add COLLECTING_YEAR_LEVEL state to pipeline and create year level parsing function
- [ ] Update chatRoutes.js to collect year level between workload and transcript
- [ ] Update generateSchedule() to accept year level and use it for course recommendations when transcript is unavailable
- [ ] Update scheduleExporter.js to use getNextSemester() for exports
/**
 * PHHS Factoring Review — Apps Script backend.
 *
 * Bind this script to a Google Sheet with two tabs, each with a header row
 * exactly as listed below (this script reads/writes by header name, not by
 * fixed column index):
 *
 *   Roster:    SNumber | StudentName | TeacherName
 *   Responses: Timestamp | Date | SNumber | StudentName | TeacherName | Score | Total | ProblemsJSON | AnswersJSON
 *
 * ── MANUAL DEPLOYMENT STEPS (do this yourself in the Apps Script UI) ──
 * 1. Open the target Google Sheet, then Extensions > Apps Script, and paste
 *    this file in as Code.gs (container-bound to that Sheet).
 * 2. In the Sheet, create tabs named exactly "Roster" and "Responses" with
 *    the header rows above in row 1 (case-sensitive column names).
 * 3. In the Apps Script editor: Deploy > New deployment.
 * 4. Click the gear icon next to "Select type" and choose "Web app".
 * 5. Set "Execute as" to "Me" — so the script can read/write the Sheet
 *    under your account regardless of who calls the URL.
 * 6. Set "Who has access" to "Anyone" — required so the static index.html
 *    page and any teacher dashboard can call it without a Google login.
 * 7. Click Deploy, authorize the requested permissions, then copy the Web
 *    app URL. That URL is the endpoint the front end POSTs to (doPost) and
 *    GETs from (doGet).
 * 8. After any future edit to this file, the live URL keeps serving the old
 *    code until you publish a new version: Deploy > Manage deployments >
 *    edit (pencil icon) > New version > Deploy.
 */

const ROSTER_SHEET_NAME = 'Roster';
const RESPONSES_SHEET_NAME = 'Responses';
const UNASSIGNED_TEACHER = 'Unassigned';
const UNKNOWN_STUDENT = 'Unknown';

const RESPONSES_ROW_ORDER = [
  'Timestamp', 'Date', 'SNumber', 'StudentName', 'TeacherName', 'Score', 'Total', 'ProblemsJSON', 'AnswersJSON'
];

function getSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error(`Missing "${name}" sheet tab.`);
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Reads a sheet's data (including the header row) into an array of plain
// objects keyed by the header row's column names.
function readRowsAsObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

// Canonical S-number form used both for Roster comparisons and for what
// gets written into Responses, so all stored records use consistent casing.
function normalizeSid_(sid) {
  return String(sid == null ? '' : sid).trim().toUpperCase();
}

// Sheets sometimes auto-converts a plain "YYYY-MM-DD" string into a Date
// cell value on write; normalize both back to "YYYY-MM-DD" for comparison.
function normalizeDateValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value == null ? '' : value).trim();
}

// SNumber -> {teacherName, studentName}, matched case-insensitively with
// trimmed whitespace. Falls back to UNASSIGNED_TEACHER / UNKNOWN_STUDENT for
// whichever piece is missing (including when no Roster row matches at all).
function lookupRosterInfo_(sid) {
  const rows = readRowsAsObjects_(getSheet_(ROSTER_SHEET_NAME));
  const target = normalizeSid_(sid);
  for (const row of rows) {
    if (normalizeSid_(row.SNumber) === target) {
      const teacherName = String(row.TeacherName == null ? '' : row.TeacherName).trim();
      const studentName = String(row.StudentName == null ? '' : row.StudentName).trim();
      return {
        teacherName: teacherName || UNASSIGNED_TEACHER,
        studentName: studentName || UNKNOWN_STUDENT
      };
    }
  }
  return { teacherName: UNASSIGNED_TEACHER, studentName: UNKNOWN_STUDENT };
}

/**
 * Accepts a JSON POST body: {date, sid, score, total, problems, answers}.
 * Looks up the student's teacher and name from Roster (falling back to
 * "Unassigned" / "Unknown" rather than rejecting the submission) and
 * appends one row to Responses.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Missing request body.');
    }
    const body = JSON.parse(e.postData.contents);
    const normalizedSid = normalizeSid_(body.sid);
    const { teacherName, studentName } = lookupRosterInfo_(normalizedSid);

    const rowByHeader = {
      Timestamp: new Date(),
      Date: body.date,
      SNumber: normalizedSid,
      StudentName: studentName,
      TeacherName: teacherName,
      Score: body.score,
      Total: body.total,
      ProblemsJSON: JSON.stringify(body.problems == null ? [] : body.problems),
      AnswersJSON: JSON.stringify(body.answers == null ? [] : body.answers)
    };

    getSheet_(RESPONSES_SHEET_NAME).appendRow(
      RESPONSES_ROW_ORDER.map(header => rowByHeader[header])
    );

    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * Without a `teacher` query param: returns {ok:true, teachers:[...]} — a
 * deduplicated, alphabetized list of every distinct TeacherName in Roster,
 * for the dashboard to populate its dropdown.
 *
 * With a `teacher` query param (sent verbatim from that dropdown): returns
 * {ok:true, rows:[...]} — every Responses row whose TeacherName exactly
 * matches, optionally further filtered by a `date` query param. Each row
 * object carries every Responses column (including StudentName) since
 * readRowsAsObjects_ maps by header name rather than a fixed column list.
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const teacher = params.teacher;

    if (!teacher) {
      const names = readRowsAsObjects_(getSheet_(ROSTER_SHEET_NAME))
        .map(row => String(row.TeacherName == null ? '' : row.TeacherName).trim())
        .filter(name => name.length > 0);
      const teachers = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
      return jsonOutput_({ ok: true, teachers: teachers });
    }

    let rows = readRowsAsObjects_(getSheet_(RESPONSES_SHEET_NAME))
      .filter(row => String(row.TeacherName == null ? '' : row.TeacherName).trim() === teacher);

    if (params.date) {
      const dateFilter = normalizeDateValue_(params.date);
      rows = rows.filter(row => normalizeDateValue_(row.Date) === dateFilter);
    }

    return jsonOutput_({ ok: true, rows: rows });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

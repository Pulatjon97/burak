from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Preformatted
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.colors import HexColor
from xml.sax.saxutils import escape
from pathlib import Path

OUT = Path('output/pdf/member_api_recent_changes_explained.pdf')
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = letter
NAVY = HexColor('#17324D')
BLUE = HexColor('#2563EB')
PALE = HexColor('#EFF6FF')
LIGHT = HexColor('#F3F4F6')
INK = HexColor('#17212B')
MUTED = HexColor('#526171')
GOLD = HexColor('#FEF3C7')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CoverTitleX', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=26, leading=32, textColor=NAVY, alignment=TA_LEFT, spaceAfter=14))
styles.add(ParagraphStyle(name='SubtitleX', parent=styles['Normal'], fontName='Helvetica', fontSize=12, leading=18, textColor=MUTED, spaceAfter=16))
styles.add(ParagraphStyle(name='H1X', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=17, leading=22, textColor=NAVY, spaceBefore=6, spaceAfter=9, keepWithNext=True))
styles.add(ParagraphStyle(name='H2X', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12.5, leading=16, textColor=BLUE, spaceBefore=7, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name='BodyX', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.5, leading=14, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name='SmallX', parent=styles['BodyText'], fontName='Helvetica', fontSize=8, leading=11, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name='CodeCellX', parent=styles['BodyText'], fontName='Courier', fontSize=7.2, leading=9.2, textColor=INK, spaceAfter=0, splitLongWords=1))
styles.add(ParagraphStyle(name='ExplainCellX', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.4, leading=11.4, textColor=INK, spaceAfter=0))
styles.add(ParagraphStyle(name='HeaderCellX', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=8.4, leading=11.4, textColor=colors.white, spaceAfter=0))
styles.add(ParagraphStyle(name='CalloutX', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=NAVY, backColor=PALE, borderColor=BLUE, borderWidth=0.5, borderPadding=8, spaceBefore=5, spaceAfter=9))

story = []
def P(text, style='BodyX'):
    story.append(Paragraph(text, styles[style]))
def H(text, level=1):
    story.append(Paragraph(text, styles['H1X' if level == 1 else 'H2X']))
def code(text):
    story.append(Preformatted(text, ParagraphStyle('CodeBlockX', fontName='Courier', fontSize=8, leading=10, textColor=INK, backColor=LIGHT, borderColor=HexColor('#D1D5DB'), borderWidth=0.5, borderPadding=7, leftIndent=6, rightIndent=6, spaceBefore=2, spaceAfter=8)))
def line_table(rows, widths=(2.75*inch, 3.95*inch)):
    data = [[Paragraph('Code line', styles['HeaderCellX']), Paragraph('Purpose', styles['HeaderCellX'])]]
    for snippet, explanation in rows:
        data.append([Paragraph('<font name="Courier">'+escape(snippet)+'</font>', styles['CodeCellX']), Paragraph(explanation, styles['ExplainCellX'])])
    t = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),NAVY),('TEXTCOLOR',(0,0),(-1,0),colors.white),
        ('BACKGROUND',(0,1),(-1,-1),colors.white),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),
        ('GRID',(0,0),(-1,-1),0.35,HexColor('#CBD5E1')),
        ('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
        ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))

def header_footer(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setStrokeColor(HexColor('#D6DEE8'))
        canvas.line(doc.leftMargin, PAGE_H-0.48*inch, PAGE_W-doc.rightMargin, PAGE_H-0.48*inch)
        canvas.setFont('Helvetica-Bold', 8)
        canvas.setFillColor(NAVY)
        canvas.drawString(doc.leftMargin, PAGE_H-0.37*inch, 'MEMBER REST API - RECENT CHANGES')
    canvas.setStrokeColor(HexColor('#D6DEE8'))
    canvas.line(doc.leftMargin, 0.48*inch, PAGE_W-doc.rightMargin, 0.48*inch)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.31*inch, 'Burak project | explanation of the four most recent commits')
    canvas.drawRightString(PAGE_W-doc.rightMargin, 0.31*inch, f'Page {doc.page}')
    canvas.restoreState()

# Cover
story.append(Spacer(1, 0.65*inch))
P('Understanding the Recent<br/>Member API Changes', 'CoverTitleX')
P('A line-by-line guide to the four latest commits for getTopUsers and getRestaurant', 'SubtitleX')
P('Prepared from the project history on the develop branch. The commits are explained in chronological order, including the original code, the later typo fixes, and what the current lines do.', 'BodyX')
P('<b>Main idea:</b> MongoDB field names are case-sensitive. In two filters, the code used capitalized field names that did not exist in the schema. Because this project enables Mongoose strictQuery, those unknown filter fields could be removed, leaving a query that matched an arbitrary first record.', 'CalloutX')
H('The four commits covered', 1)
commit_rows = [
    [Paragraph('Order', styles['HeaderCellX']), Paragraph('Commit', styles['HeaderCellX']), Paragraph('What it changed', styles['HeaderCellX'])],
    ['1', Paragraph('f6891e4 - feat: develop getTopUsers rest Api', styles['ExplainCellX']), Paragraph('Added the top-users service query, controller, and route. Its status filter initially had the casing error.', styles['ExplainCellX'])],
    ['2', Paragraph('fffd57b - feat: create getRestaurant rest Api', styles['ExplainCellX']), Paragraph('Added the restaurant service query, controller, and route. Its type filter initially had the casing error.', styles['ExplainCellX'])],
    ['3', Paragraph('47b2ae4 - fix: typo in Member.service.ts', styles['ExplainCellX']), Paragraph('Changed MemberType to memberType in the restaurant query.', styles['ExplainCellX'])],
    ['4', Paragraph('3975608 - fix: typo fixed on line 110', styles['ExplainCellX']), Paragraph('Changed MemberStatus to memberStatus in top users, and changed the extra target string.', styles['ExplainCellX'])],
]
t = Table(commit_rows, colWidths=[0.48*inch, 2.65*inch, 3.55*inch], repeatRows=1)
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),0.35,HexColor('#CBD5E1')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('VALIGN',(0,0),(-1,-1),'TOP'),('FONTSIZE',(0,1),(-1,-1),8),('LEADING',(0,1),(-1,-1),10),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
story.append(t)
story.append(Spacer(1, 8))
P('These are commits shown by git log. The word "push" is often used casually for saved project changes; a commit is the recorded change, while a push sends commits to a remote repository. This guide explains the four commits visible in the local history.', 'SmallX')
story.append(PageBreak())

# Foundation
H('Before the line-by-line review', 1)
P('The project schema uses the field names <font name="Courier">memberType</font> and <font name="Courier">memberStatus</font>. Those exact spellings matter in MongoDB filters. The enum constants on the right side are values; they do not rename the database fields.', 'BodyX')
code('memberType: MemberType.RESTAURANT\nmemberStatus: MemberStatus.ACTIVE')
P('The server also calls <font name="Courier">mongoose.set("strictQuery", true)</font>. In Mongoose 6, strictQuery removes filter keys that are not in the schema. For example, a filter containing only an unknown key can become an empty filter <font name="Courier">{}</font>. An empty filter can match any document, which explains why a query may return a regular member instead of a restaurant. This behavior is described in the Mongoose 6 guide.', 'BodyX')
code('Wrong field:   { MemberType: MemberType.RESTAURANT }\nAfter strictQuery strips unknown key:  {}\nCorrect field: { memberType: MemberType.RESTAURANT }')
P('A MongoDB document can have extra fields, but your Mongoose schema and your queries use the schema field names. Uppercase and lowercase letters are different characters.', 'BodyX')

# Commit 1 top users
H('Commit 1 - add getTopUsers', 1)
P('<b>Commit:</b> <font name="Courier">f6891e4</font> - <i>feat: develop getTopUsers rest Api</i>. This commit added three connected pieces: a service query, a controller handler, and a route.', 'BodyX')
H('Service query - Member.service.ts', 2)
code('public async getTopUsers(): Promise<Member[]> {\n  const result = await this.memberModel\n    .find({ MemberStatus: MemberStatus.ACTIVE, memberPoints: { $gte: 1 } })\n    .sort({ memberPoints: -1 })\n    .limit(4)\n    .exec();\n  if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);\n  return result;\n}')
line_table([
('public async getTopUsers(): Promise<Member[]> {', 'Declares an asynchronous service method that returns a list of member records. The angle-bracket type says each array item is a Member.'),
('const result = await this.memberModel', 'Starts a Mongoose query against the member collection and waits for it to finish.'),
('.find({ MemberStatus: MemberStatus.ACTIVE, memberPoints: { $gte: 1 } })', 'Finds records intended to be active and have at least one point. At this commit, <font name="Courier">MemberStatus</font> was incorrectly capitalized, so it did not match the schema field.'),
('.sort({ memberPoints: -1 })', 'Sorts by points descending: largest point totals first. The value -1 means descending.'),
('.limit(4)', 'Returns at most four records.'),
('.exec();', 'Executes the built query and resolves to the result array.'),
('if (!result) throw ...NO_DATA_FOUND;', 'Intended as a not-found check. A Mongoose find query returns an array; even an empty array is truthy, so this condition does not catch zero matches.'),
('return result;', 'Returns the selected records to the controller.'),
('}', 'Ends the method.')
])
H('Controller and route', 2)
line_table([
('memberController.getTopUsers = async (req, res) => {', 'Creates the HTTP handler. It is async because the service query takes time.'),
('console.log("getTopUsers");', 'Prints a diagnostic message in the server terminal when the handler runs.'),
('const result = await memberService.getTopUsers();', 'Calls the service and waits for the top-member array.'),
('res.status(HttpCode.OK).json(result)', 'Sends HTTP 200 and serializes the result array as JSON.'),
('catch (err) { ... }', 'Handles failures. An Errors instance uses its own status code; other errors use the standard server error response.'),
('router.get("/member/top-users", memberController.getTopUsers);', 'Makes the handler available for GET requests at /member/top-users.')
])
P('<b>What needed correction later:</b> the query used <font name="Courier">MemberStatus</font> rather than the schema field <font name="Courier">memberStatus</font>. With strictQuery enabled, that status constraint could be stripped, so blocked or deleted members with points could pass the remaining points filter.', 'CalloutX')
story.append(PageBreak())

# Commit 2 restaurant
H('Commit 2 - add getRestaurant', 1)
P('<b>Commit:</b> <font name="Courier">fffd57b</font> - <i>feat: create getRestaurant rest Api</i>. It added a service lookup, controller, and route.', 'BodyX')
H('Original service query from this commit', 2)
code('public async getRestaurant(): Promise<Member> {\n  const result = await this.memberModel\n    .findOne({ MemberType: MemberType.RESTAURANT })\n    .lean()\n    .exec();\n  result.target = "Test";\n  if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);\n  return result;\n}')
line_table([
('public async getRestaurant(): Promise<Member> {', 'Declares a service method that should return one member record, specifically the restaurant account.'),
('const result = await this.memberModel', 'Starts a query against the member collection.'),
('.findOne({ MemberType: MemberType.RESTAURANT })', 'Intended to select the restaurant. The filter key was wrong: schema uses lowercase <font name="Courier">memberType</font>.'),
('.lean()', 'Asks Mongoose to return a plain JavaScript object instead of a full Mongoose document.'),
('.exec();', 'Executes the findOne query. It returns a document object or null if no match exists.'),
('result.target = "Test";', 'Adds an arbitrary property named <font name="Courier">target</font> to the returned plain object. This is not part of selecting a restaurant; it appears in the JSON response and is likely leftover test data.'),
('if (!result) throw ...NO_DATA_FOUND;', 'Intended to report no restaurant found. In the original order, the previous target assignment ran first, so null would cause a TypeError before this intended error.'),
('return result;', 'Returns the selected object to the controller.'),
('}', 'Ends the service method.')
])
H('Controller and route', 2)
line_table([
('memberController.getRestaurant = async (req, res) => {', 'Creates the Express handler for the restaurant lookup.'),
('console.log("getRestaurant");', 'Writes a diagnostic log when the endpoint is called.'),
('const result = await memberService.getRestaurant();', 'Calls the service method and waits for the restaurant record.'),
('res.status(HttpCode.OK).json(result);', 'Returns HTTP 200 and the record as JSON.'),
('catch (err) { ... }', 'Logs failures and returns the custom error status when available, otherwise the standard error.'),
('router.get("/member/restaurant", memberController.getRestaurant)', 'Registers the endpoint for GET /member/restaurant.')
])
P('Because the original filter key was unknown, strictQuery could remove it and leave an empty filter. Then findOne could return the first member document, which may be a regular USER.', 'CalloutX')
story.append(PageBreak())

# Fix commits
H('Commit 3 - correct the restaurant field name', 1)
P('<b>Commit:</b> <font name="Courier">47b2ae4</font> - the commit message says there was a typo around line 25 of Member.service.ts. The functional change was:', 'BodyX')
code('Before: .findOne({ MemberType: MemberType.RESTAURANT })\nAfter:  .findOne({ memberType: MemberType.RESTAURANT })')
line_table([
('memberType', 'Matches the exact field name in the schema.'),
('MemberType.RESTAURANT', 'Uses the enum value "RESTAURANT" as the value to match. The enum constant itself may be capitalized; that is separate from the database field name.'),
('.lean().exec()', 'Keeps the query execution and plain-object response behavior unchanged.'),
('result.target = "Test";', 'This line was not removed by this fix. It remained an extra field on the output object.'),
('if (!result) ...', 'Still checks whether no restaurant exists, but the target assignment is before it in the checked-in code.')
])
P('This fix addresses the instructor complaint about getting an ordinary member: the query now filters by the real type field. It does not remove the extra target property or fix the null-check ordering.', 'BodyX')

H('Commit 4 - correct the top-users status field', 1)
P('<b>Commit:</b> <font name="Courier">3975608</font> - <i>fix: typo fixed on line 110</i>. It includes two changes in the current history: the status filter correction and a change to the target test string.', 'BodyX')
code('Before: .find({ MemberStatus: MemberStatus.ACTIVE, memberPoints: { $gte: 1 } })\nAfter:  .find({ memberStatus: MemberStatus.ACTIVE, memberPoints: { $gte: 1 } })')
line_table([
('memberStatus: MemberStatus.ACTIVE', 'Now uses the schema field name, so the query requires an active member. Blocked and deleted records are excluded.'),
('memberPoints: { $gte: 1 }', 'Keeps only members with one or more points.'),
('.sort({ memberPoints: -1 })', 'Keeps highest point totals first.'),
('.limit(4)', 'Keeps the output to the top four matching records.'),
('result.target = "shungashunay";', 'The latest commit changed the extra target property string. It still does not help find a restaurant and may be included in the endpoint JSON response.'),
])
P('The filter correction is what fixes blocked/deleted members appearing in getTopUsers. It does not add a memberType USER filter, so an active restaurant with at least one point would also qualify unless the data model prevents that.', 'BodyX')

# Current state and lessons
H('Current behavior and takeaways', 1)
line_table([
('GET /member/restaurant', 'Calls getRestaurant, which now queries memberType equal to RESTAURANT.'),
('GET /member/top-users', 'Calls getTopUsers, which now filters memberStatus equal to ACTIVE and memberPoints greater than or equal to 1; sorts and limits to four.'),
('result.target = "shungashunay"', 'Is still present in current Member.service.ts. It adds a non-schema property to the restaurant response. If there is no matching restaurant, this assignment can throw before the custom 404 error is reached.'),
('if (!result) for an array', 'A find() result is always an array. To detect no top users, the appropriate condition would check result.length === 0. This is an observation, not a code change made for this explanation.'),
])
P('<b>Reliable way to avoid this class of bug:</b> copy database field names from the schema exactly. For a query filter, compare the left-hand key (database field) with the schema; the right-hand value (enum constant) can have a different capitalization.', 'CalloutX')
H('Useful project references', 2)
P('Project history: commits f6891e4, fffd57b, 47b2ae4, and 3975608 on develop.', 'BodyX')
P('Current code locations: src/models/Member.service.ts (getRestaurant around lines 23-30; getTopUsers around lines 108-115), src/controllers/member.controller.ts (getRestaurant around lines 19-31; getTopUsers around lines 157-168), and src/router.ts (routes around lines 7 and 28).', 'BodyX')
P('Mongoose reference: Mongoose 6 Guide, "strictQuery" option - https://mongoosejs.com/docs/6.x/docs/guide.html', 'SmallX')


doc = SimpleDocTemplate(str(OUT), pagesize=letter, rightMargin=0.65*inch, leftMargin=0.65*inch, topMargin=0.7*inch, bottomMargin=0.68*inch, title='Understanding the Recent Member API Changes', author='Codex')
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(OUT.resolve())

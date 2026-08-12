import { SemesterData } from '../data/curriculumData';

export function exportSemesterToPDF(semester: SemesterData) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to download the Semester Syllabus PDF.');
    return;
  }

  const subjectsHTML = semester.subjects
    .map(
      (sub, index) => `
    <div style="margin-bottom: 24px; padding: 18px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #f8fafc; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">${index + 1}. ${sub.title}</h3>
        <span style="font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background-color: #e0e7ff; color: #3730a3;">${sub.category}</span>
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569; line-height: 1.5;">${sub.description}</p>
      
      <div style="margin-top: 10px;">
        <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">Topics & Subtopics Checklist</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #1e293b; line-height: 1.8;">
          ${sub.topics
            .map(
              (t) => `
            <li style="margin-bottom: 4px;">
              <span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid #64748b; border-radius: 3px; vertical-align: middle; margin-right: 6px; text-align: center; line-height: 12px; font-size: 10px; font-weight: bold; color: #16a34a;">
                ${t.completed ? '✓' : ''}
              </span>
              <span>${t.name}</span>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    </div>
  `
    )
    .join('');

  const projectsHTML = semester.suggestedProjects
    .map(
      (proj, index) => `
    <div style="margin-bottom: 16px; padding: 16px; border: 1px dashed #6366f1; border-radius: 12px; background-color: #eef2ff; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #1e1b4b;">Project #${index + 1}: ${proj.title}</h4>
        <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 12px; background-color: #dbeafe; color: #1e40af;">${proj.difficulty}</span>
      </div>
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #334155; line-height: 1.5;">${proj.description}</p>
      <div style="font-size: 11px; color: #4338ca; font-weight: 600;">
        Tech Stack: ${proj.techStack.join(' • ')}
      </div>
    </div>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AI Frands - ${semester.title} (${semester.subtitle}) Syllabus</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 32px;
            color: #0f172a;
            background-color: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 22px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .subtitle {
            font-size: 14px;
            font-weight: 600;
            color: #6366f1;
            margin: 0 0 8px 0;
          }
          .desc {
            font-size: 13px;
            color: #475569;
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 800;
            color: #1e1b4b;
            border-left: 4px solid #4f46e5;
            padding-left: 10px;
            margin: 28px 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">AI FRANDS CS PLATFORM</div>
            <div style="font-size: 11px; color: #64748b;">Computer Science Curriculum Syllabus Export</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            Generated on: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <h1 class="title">${semester.title}: ${semester.subtitle}</h1>
        <div class="subtitle">Year ${semester.year} Computer Science Pathway</div>
        <p class="desc">${semester.description}</p>

        <div class="section-title">Core Subjects & Subtopics Checklist</div>
        ${subjectsHTML}

        <div class="section-title" style="border-left-color: #f59e0b;">Suggested Hands-On Projects</div>
        ${projectsHTML}

        <div class="footer">
          Official CS Syllabus Document • AI Frands Computer Science Learning Platform • Confidential Student Copy
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

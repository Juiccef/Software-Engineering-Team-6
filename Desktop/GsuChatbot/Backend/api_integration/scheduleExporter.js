/**
 * Schedule Export Service
 * 
 * Generates PDF and Notion template exports for generated schedules.
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

/**
 * Get the current or next semester based on the current date
 * @returns {string} - Semester string like "Fall 2026" or "Spring 2026"
 */
function getCurrentSemester() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Academic year typically runs:
  // Fall: August-December (months 8-12)
  // Spring: January-May (months 1-5)
  // Summer: June-July (months 6-7)
  
  if (currentMonth >= 8 || currentMonth <= 1) {
    // August-December or January: Current/Next Fall
    if (currentMonth >= 8) {
      // We're in Fall semester
      return `Fall ${currentYear}`;
    } else {
      // We're in January, so next major semester is Fall of this year
      return `Fall ${currentYear}`;
    }
  } else if (currentMonth >= 2 && currentMonth <= 5) {
    // February-May: Spring semester
    return `Spring ${currentYear}`;
  } else {
    // June-July: Summer, so next is Fall
    return `Fall ${currentYear}`;
  }
}

/**
 * Generate PDF from schedule data
 * Note: Requires pdfkit library - install with: npm install pdfkit
 * @param {Object} scheduleData - Schedule data object
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateSchedulePDF(scheduleData) {
  try {
    // Check if pdfkit is available
    let PDFDocument;
    try {
      PDFDocument = require('pdfkit');
    } catch (error) {
      throw new Error('PDFKit library not installed. Run: npm install pdfkit');
    }

    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    // Set up event handlers BEFORE writing content
    return new Promise((resolve, reject) => {
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Add title
      doc.fontSize(20).text('Course Schedule', { align: 'center' });
      doc.moveDown();
      
      // Add semester and major info
      doc.fontSize(14);
      doc.text(`Semester: ${scheduleData.semester || getCurrentSemester()}`);
      doc.text(`Major: ${scheduleData.major || 'N/A'}`);
      doc.text(`Total Credits: ${scheduleData.totalCredits || 0}`);
      doc.text(`Workload: ${scheduleData.workloadPreference || 'medium'}`);
      doc.moveDown();

      // Add courses table
      doc.fontSize(12);
      doc.text('Courses:', { underline: true });
      doc.moveDown(0.5);

      scheduleData.courses?.forEach((course, index) => {
        doc.fontSize(11);
        doc.text(`${index + 1}. ${course.code} - ${course.name} (${course.credits} credits)`, { bold: true });
        doc.moveDown(0.5);
      });

      // Add footer
      doc.fontSize(8);
      doc.text(`Generated: ${scheduleData.generatedAt || new Date().toISOString()}`, 50, doc.page.height - 50, { align: 'center' });

      // Finalize PDF
      doc.end();
    });

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generate Notion template from schedule data
 * @param {Object} scheduleData - Schedule data object
 * @returns {string} - Notion markdown/CSV format
 */
function generateNotionTemplate(scheduleData) {
  try {
    let template = `# ${scheduleData.semester || getCurrentSemester()} Course Schedule\n\n`;
    template += `**Major:** ${scheduleData.major || 'N/A'}\n`;
    template += `**Total Credits:** ${scheduleData.totalCredits || 0}\n`;
    template += `**Workload:** ${scheduleData.workloadPreference || 'medium'}\n\n`;
    template += `---\n\n`;

    // Create table header
    template += `| Course Code | Course Name | Credits |\n`;
    template += `|-------------|-------------|---------|\n`;

    // Add courses
    scheduleData.courses?.forEach(course => {
      template += `| ${course.code} | ${course.name} | ${course.credits} |\n`;
    });

    template += `\n---\n\n`;
    template += `*Generated: ${scheduleData.generatedAt || new Date().toISOString()}*\n`;

    return template;

  } catch (error) {
    console.error('❌ Error generating Notion template:', error);
    throw error;
  }
}

/**
 * Generate CSV format for schedule
 * @param {Object} scheduleData - Schedule data object
 * @returns {string} - CSV format
 */
function generateCSV(scheduleData) {
  try {
    let csv = 'Course Code,Course Name,Credits,Section,Days,Time,Professor,Location\n';

    scheduleData.courses?.forEach(course => {
      course.sections?.forEach((section, index) => {
        const courseCode = index === 0 ? course.code : '';
        const courseName = index === 0 ? course.name : '';
        const credits = index === 0 ? course.credits : '';
        
        csv += `"${courseCode}","${courseName}","${credits}","${section.section || index + 1}","${section.days || 'TBA'}","${section.time || 'TBA'}","${section.professor || 'TBA'}","${section.location || 'TBA'}"\n`;
      });
    });

    return csv;

  } catch (error) {
    console.error('❌ Error generating CSV:', error);
    throw error;
  }
}

module.exports = {
  generateSchedulePDF,
  generateNotionTemplate,
  generateCSV
};




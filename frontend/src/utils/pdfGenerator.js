import jsPDF from 'jspdf';

export const generateGameTicketPDF = (ticket, game) => {
  const doc = new jsPDF();
  
  // Set colors
  const primaryColor = [37, 99, 235]; // Blue
  const secondaryColor = [107, 114, 128]; // Gray
  
  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GAME TICKET', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('SkillMatch Sports Platform', 105, 30, { align: 'center' });
  
  // Ticket ID
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 50, 180, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Ticket ID: ${ticket.ticketId}`, 105, 59, { align: 'center' });
  
  // Game Details Section
  let yPos = 80;
  
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GAME DETAILS', 20, yPos + 6);
  
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  // Game info
  doc.setFont('helvetica', 'bold');
  doc.text('Game:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(game.title, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Sport:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(game.sportType, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(game.date).toLocaleDateString('en-IN', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Time:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${game.startTime} - ${game.endTime}`, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Venue:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  const venueName = game.venue?.name || 'TBD';
  doc.text(venueName, 55, yPos);
  
  if (game.venue?.location) {
    yPos += 8;
    doc.text('', 20, yPos);
    doc.setFontSize(10);
    const location = `${game.venue.location.address || ''}, ${game.venue.location.city || ''}`.trim();
    doc.text(location, 55, yPos);
    doc.setFontSize(11);
  }
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Skill Level:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(game.skillLevel, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Entry Fee:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`₹${game.cost}`, 55, yPos);
  
  // Player Details Section
  yPos += 15;
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PLAYER DETAILS', 20, yPos + 6);
  
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(ticket.playerInfo.name, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(ticket.playerInfo.email, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(ticket.playerInfo.phone, 55, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Date:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(ticket.bookingDate).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }), 55, yPos);
  
  // Status
  yPos += 15;
  doc.setFillColor(34, 197, 94); // Green
  doc.rect(15, yPos, 180, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Status: ${ticket.status}`, 105, yPos + 7, { align: 'center' });
  
  // Footer
  yPos = 270;
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Please bring this ticket on the day of the event.', 105, yPos, { align: 'center' });
  doc.text('For queries, contact: support@skillmatch.com', 105, yPos + 5, { align: 'center' });
  
  // Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(10, 45, 190, yPos - 50);
  
  // Save
  doc.save(`GameTicket_${ticket.ticketId}.pdf`);
};

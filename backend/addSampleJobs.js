const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');

async function addSampleJobs() {
  try {
    await mongoose.connect('mongodb+srv://noteadeveloper:Niti%402722@niitsh.lqsfzmh.mongodb.net/skillmatch', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Find or create a sample user
    let sampleUser = await User.findOne({ email: 'sample@example.com' });
    if (!sampleUser) {
      sampleUser = new User({
        firstName: 'Sample',
        lastName: 'User',
        email: 'sample@example.com',
        password: 'password123',
        phone: '1234567890',
        skills: [
          { skillName: 'Coaching', proficiencyLevel: 'Advanced' },
          { skillName: 'Management', proficiencyLevel: 'Advanced' }
        ],
        location: { city: 'New York', state: 'NY' },
        userType: 'Venue Manager'
      });
      await sampleUser.save();
      console.log('Sample user created');
    }

    const sampleJobs = [
      {
        title: 'Senior Basketball Coach',
        description: 'Looking for an experienced basketball coach to lead our youth team. Must have coaching certification and 3+ years of experience.',
        location: 'New York, NY',
        salary: { min: 45000, max: 65000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Basketball Coaching', proficiencyLevel: 'Expert' },
          { skillName: 'Team Management', proficiencyLevel: 'Advanced' },
          { skillName: 'Player Development', proficiencyLevel: 'Advanced' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Coach',
        venue: '69217a9688de532ac61bd1bf'
      },
      {
        title: 'Soccer Referee Assistant',
        description: 'Assist with officiating youth soccer matches. Training provided. Flexible hours.',
        location: 'Los Angeles, CA',
        salary: { min: 20000, max: 30000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Soccer Rules', proficiencyLevel: 'Intermediate' },
          { skillName: 'Physical Fitness', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Umpire',
        venue: '69217a9788de532ac61bd1c2'
      },
      {
        title: 'Event Setup Helper',
        description: 'Help set up and break down sports equipment for various events. Part-time position.',
        location: 'Chicago, IL',
        salary: { min: 15000, max: 25000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Equipment Handling', proficiencyLevel: 'Beginner' },
          { skillName: 'Physical Labor', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Helper',
        venue: '69217a9788de532ac61bd1c4'
      },
      {
        title: 'Tennis Court Maintenance Staff',
        description: 'Maintain tennis courts and facilities. Full-time position with benefits.',
        location: 'Boston, MA',
        salary: { min: 30000, max: 40000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Maintenance', proficiencyLevel: 'Advanced' },
          { skillName: 'Youth Sports', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Staff',
        venue: '69217a9788de532ac61bd1c6'
      },
      {
        title: 'Swimming Pool Lifeguard',
        description: 'Monitor pool safety and provide assistance. Lifeguard certification required.',
        location: 'Phoenix, AZ',
        salary: { min: 25000, max: 35000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Lifeguarding', proficiencyLevel: 'Expert' },
          { skillName: 'CPR', proficiencyLevel: 'Expert' },
          { skillName: 'First Aid', proficiencyLevel: 'Advanced' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Staff',
        venue: '69217a9788de532ac61bd1c8'
      },
      {
        title: 'Volleyball Referee',
        description: 'Officiate volleyball matches at various levels. Certification preferred.',
        location: 'Seattle, WA',
        salary: { min: 22000, max: 32000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Volleyball Rules', proficiencyLevel: 'Advanced' },
          { skillName: 'Referee Training', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Umpire',
        venue: '69217a9788de532ac61bd1ca'
      },
      {
        title: 'Gym Equipment Technician',
        description: 'Maintain and repair gym equipment. Technical experience required.',
        location: 'Denver, CO',
        salary: { min: 40000, max: 55000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Equipment Repair', proficiencyLevel: 'Expert' },
          { skillName: 'Technical Skills', proficiencyLevel: 'Advanced' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Staff',
        venue: '69217a9688de532ac61bd1bf'
      },
      {
        title: 'Youth Soccer Coach',
        description: 'Coach youth soccer teams and develop young players. USSF certification preferred.',
        location: 'Los Angeles, CA',
        salary: { min: 35000, max: 50000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Soccer Coaching', proficiencyLevel: 'Advanced' },
          { skillName: 'Youth Development', proficiencyLevel: 'Advanced' },
          { skillName: 'Team Management', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Coach',
        venue: '69217a9788de532ac61bd1c2'
      },
      {
        title: 'Basketball Referee',
        description: 'Officiate basketball games at various levels. NBA referee certification a plus.',
        location: 'Chicago, IL',
        salary: { min: 30000, max: 45000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Basketball Rules', proficiencyLevel: 'Expert' },
          { skillName: 'Referee Training', proficiencyLevel: 'Advanced' },
          { skillName: 'Physical Fitness', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Umpire',
        venue: '69217a9788de532ac61bd1c4'
      },
      {
        title: 'Event Coordinator',
        description: 'Coordinate sports events and tournaments. Excellent organizational skills required.',
        location: 'Miami, FL',
        salary: { min: 40000, max: 60000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Event Planning', proficiencyLevel: 'Advanced' },
          { skillName: 'Communication', proficiencyLevel: 'Advanced' },
          { skillName: 'Organization', proficiencyLevel: 'Expert' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Staff',
        venue: '69217a9788de532ac61bd1c6'
      },
      {
        title: 'Tennis Instructor',
        description: 'Teach tennis lessons to players of all skill levels. PTR certification preferred.',
        location: 'Boston, MA',
        salary: { min: 28000, max: 42000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Tennis Instruction', proficiencyLevel: 'Advanced' },
          { skillName: 'Player Development', proficiencyLevel: 'Intermediate' },
          { skillName: 'Teaching', proficiencyLevel: 'Advanced' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Coach',
        venue: '69217a9788de532ac61bd1c8'
      },
      {
        title: 'Facility Maintenance Helper',
        description: 'Assist with general facility maintenance and cleaning. Part-time position.',
        location: 'Phoenix, AZ',
        salary: { min: 20000, max: 30000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Maintenance', proficiencyLevel: 'Intermediate' },
          { skillName: 'Cleaning', proficiencyLevel: 'Beginner' },
          { skillName: 'Physical Labor', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Helper',
        venue: '69217a9788de532ac61bd1ca'
      },
      {
        title: 'Volleyball Coach Assistant',
        description: 'Assist head coach with volleyball training sessions and team management.',
        location: 'Seattle, WA',
        salary: { min: 25000, max: 38000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Volleyball Coaching', proficiencyLevel: 'Intermediate' },
          { skillName: 'Team Support', proficiencyLevel: 'Intermediate' },
          { skillName: 'Youth Sports', proficiencyLevel: 'Beginner' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Coach',
        venue: '69217a9788de532ac61bd1cc'
      },
      {
        title: 'Scorekeeper',
        description: 'Keep official scores for various sports games. Attention to detail required.',
        location: 'Denver, CO',
        salary: { min: 20000, max: 30000, currency: '₹' },
        requiredSkills: [
          { skillName: 'Scorekeeping', proficiencyLevel: 'Intermediate' },
          { skillName: 'Attention to Detail', proficiencyLevel: 'Advanced' },
          { skillName: 'Sports Knowledge', proficiencyLevel: 'Intermediate' }
        ],
        postedBy: sampleUser._id,
        applicationDeadline: new Date('2024-12-31'),
        jobType: 'Staff',
        venue: '69217a9688de532ac61bd1bf'
      }
    ];

    for (const jobData of sampleJobs) {
      const job = new Job(jobData);
      await job.save();
      console.log('Added job:', job.title);
    }

    console.log('All sample jobs added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding jobs:', error);
    process.exit(1);
  }
}

addSampleJobs();

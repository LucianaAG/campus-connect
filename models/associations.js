const Teacher = require('./teacher_model');
const Subject = require('./subject_model');

// un profesor imparte varías materias
Teacher.hasMany(Subject, { foreignKey: 'teacher_id' });
// varias materias son impartidas por un profesor
Subject.belongsTo(Teacher, { foreignKey: 'teacher_id' });
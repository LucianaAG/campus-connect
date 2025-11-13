const Teacher = require('./teacher_model');
const Subject = require('./subject_model');
const Student = require('./student_model');
const Inscription = require('./inscription_model');

// un profesor imparte varías materias
Teacher.hasMany(Subject, { foreignKey: 'teacher_id', onDelete: 'CASCADE', hooks: true});
// varias materias son impartidas por un profesor
Subject.belongsTo(Teacher, { foreignKey: 'teacher_id' });

Student.hasMany(Inscription, {foreignKey: 'student_id', onDelete: 'CASCADE', hooks: true});
Inscription.belongsTo(Student, {foreignKey: 'student_id'});

Subject.hasMany(Inscription, {foreignKey: 'subject_id', onDelete: 'CASCADE', hooks: true});
Inscription.belongsTo(Subject, {foreignKey: 'subject_id'});

module.exports = {
    Teacher,
    Subject,
    Student,
    Inscription
};


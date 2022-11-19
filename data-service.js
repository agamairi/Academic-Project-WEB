// var students = [];
// var programs = [];
var fs = require("fs");
const { resolve } = require("path");
const Sequelize = require('sequelize');

// Assignment 5
var sequelize = new Sequelize('awmnqczb', 'awmnqczb', 'j1fb2kz72BaRmP_jdgfjzQBgLWVWK4Gp', {
  host: 'peanut.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  }
  , query: { raw: true }
});

var Student = sequelize.define('Student',{
studentID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  isInternationalStudent: Sequelize.BOOLEAN,
  expectedCredential: Sequelize.STRING,
  status: Sequelize.STRING,
  registrationDate: Sequelize.STRING
});

// Accidently initialized prorgamCode as an INT, cannot change it now for some reason
var Program = sequelize.define('Program',{
  programCode: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  programName: Sequelize.STRING
});

Program.hasMany(Student, {foreignKey: 'program'});

// Done
module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {resolve();})
      .catch(() => {reject ("unable to sync the database");});
  });
};

// done
module.exports.getAllStudents = () => {
  return new Promise (function (resolve, reject) {
    Student.findAll()
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject("could not fetch all students");
    });
  });
};

// done 
module.exports.getStudentsByStatus = (userStatus) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        status: userStatus,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("unable to get student by status");
      });
  });
};

// done
module.exports.getStudentsByProgramCode = (progCode) => {
  return new Promise((resolve, reject) =>{
    Student.findAll({
      where: {
        program: progCode
      },
    })
    .then((data)=>{
      resolve(data);
    })
    .catch((err) => {
      reject("could not get student by program code");
    });
  });
};

module.exports.getStudentsByExpectedCredential = (credential) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        expectedCredential: credential,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("unable to get student by credential");
      });
  });
};

module.exports.getStudentById = (sid) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentID: sid,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("unable to get student by ID");
      });
  });
};


module.exports.getPrograms = () => {
  return new Promise((resolve, reject) => {
    Program.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("could not get programs");
      });
  });
};

module.exports.addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.isInternationalStudent = studentData.isInternationalStudent
      ? true
      : false;
    for (data in studentData) {
      if (studentData[data] == "") studentData[data] = null;
    }
    Student.create(studentData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to add student");
      });
  });
};



module.exports.updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.isInternationalStudent = studentData.isInternationalStudent
      ? true
      : false;
    for (data in studentData) {
      if (studentData[data] == "") studentData[data] = null;
    }
    Student.update(studentData, { where: { studentID: studentData.studentID } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to update student");
      });
  });
};

module.exports.addProgram = (programData) => {
  return new Promise((resolve, reject) => {
    for (data in programData) {
      if (data.trim() == "") {
        data = null;
      }
    }
    Program.create({
      programCode: programData.programCode,
      programName: programData.programName,
    })
      .then(() => resolve())
      .catch(() => reject("unable to add program"));
  });
};

module.exports.updateProgram = (programData) => {
  console.log(programData);
  return new Promise((resolve, reject) => {
    for (data in programData) {
      if (data.trim() == "") {
        data = null;
      }
    }
    Program.update(
      { programName: programData.programName },
      { where: { programCode: programData.programCode } }
    )
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to update program");
      });
  });
};

module.exports.getProgramByCode = (pcode) => {
  return new Promise((resolve, reject) => {
    Program.findAll({
      where: {
        programCode: pcode,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("unable to get program by code");
      });
  });
};

module.exports.deleteProgramByCode = (pcode) => {
  console.log(pcode);
  return new Promise((resolve, reject) => {
    Program.destroy({
      where: {
        programCode: pcode,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to delete program by code");
      });
  });
};

module.exports.deleteStudentById = (sId) => {
  console.log(sId);
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentID: sId,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to delete student by id");
      });
  });
};

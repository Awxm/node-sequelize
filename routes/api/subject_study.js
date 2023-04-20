const express = require('express');
const router = express.Router();
const {
  create,
  findAll,
  managementAll,
  formalAll,
  enrollmentAll,
  subjectStatus,
  formalAuditStatus,
  medicalReviewStatus
} = require('../../controllers/subject_study');

router.post('/create', create);

router.post('/list', findAll);
router.post('/management', managementAll);
router.post('/formal', formalAll);
router.post('/enrollment', enrollmentAll);

router.post('/subject_status', subjectStatus);
router.post('/formal_status', formalAuditStatus);
router.post('/enrollment_status', medicalReviewStatus);

module.exports = router;

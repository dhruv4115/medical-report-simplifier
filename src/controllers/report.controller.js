exports.processReport = async (req, res) => {
  console.log('Request body:', req.body); 
  console.log('Request file:', req.file);

  res.status(200).json({
    message: 'Request received. Processing logic to be implemented.',
    data: req.body,
    file: req.file,
  });
};
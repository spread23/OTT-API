const test = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de prueba de recruiter'
    })
}

module.exports = {
    test
}
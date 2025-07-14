

const checkReferer = (req) => {

    const referer = req.get('Referer') || '';
    return (!referer.includes('mercadopago')) ? true : false;
}

module.exports = {
    checkReferer
}
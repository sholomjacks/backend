const redibase = require('./connect')

const runner = async () => {
    console.log('Setting...')
    const val = 
    {
        sholom:'jacks',
        mendel:'jacks',
        avi:'emmer',
        MENDEL:'ZARCHI',
        guest:'123'
    }
    await redibase.set('validUsers', val)
        .catch(err => {
            console.log('Something went wrong...' + err)
        })
    console.log('Done!')
}

runner()
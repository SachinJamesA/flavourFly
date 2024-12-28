import React from 'react'
import Login from '../Utils/Login'

const CustomerOrder = () => {
    return (
        <>
            {!localStorage.getItem("accessToken") ? (
                <>
                    <div>
                        <h1 className='mt-3 mb-4'>
                            Login to access the orders
                        </h1>
                    </div>
                    <Login/>
                </>
            ) : (
                <div>CustomerOrder</div>
            )}
        </>
    )
}

export default CustomerOrder
export const successResponse = ({res, 
    statusCode=200,
    message="Done",
    data={}}
    )=>{
    res.status(statusCode).json({message,data})};


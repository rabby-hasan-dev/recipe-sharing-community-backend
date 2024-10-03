import httpStatus from "http-status";
import AppError from "../../errors/AppError";


// Helper function to validate the rating input
export const validateRating = (rating: number) => {
    if (rating < 1 || rating > 5) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Rating must be between 1 and 5 stars.');
    }
};
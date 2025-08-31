export const checkMembership = (lastRegistered,membershipLength) => {
    const lastRegisteredDate = new Date(lastRegistered);
    const today = new Date();
    //clear out timing for absolute days
    lastRegisteredDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = today-lastRegisteredDate;
    const diffInDays = Math.floor(diffTime/(1000*60*60*24));
    if (diffInDays <= membershipLength) {
        return "Active"
    } else {
        return "Inactive"
    }
}

export const overdueCalc = (borrowDate,maxLoanPeriod,penaltyPerDay) => {
    const borrowedOn = new Date(borrowDate);
    const today = new Date();
    //clear out timing for absolute days
    borrowedOn.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = today-borrowedOn;
    const diffInDays = Math.floor(diffTime/(1000*60*60*24));
    if (diffInDays <= maxLoanPeriod) {
        return 0;
    } else {
        return Math.min(20,(diffInDays-maxLoanPeriod)*penaltyPerDay);
    }
    // NOTE: the filter must be ==null and not ===null because json may return it as undefined
};

//special care needed to handle dates
//or  dateObj.toLocaleDateString()
export const findDueDate = (borrowDate) => {
    const dateObj = new Date(borrowDate);
    dateObj.setDate(dateObj.getDate()+14);
    return (dateObj.toISOString().split('T')[0]);
}
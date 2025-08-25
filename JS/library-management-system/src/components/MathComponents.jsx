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
        return Math.max(20,(diffInDays-maxLoanPeriod)*penaltyPerDay);
    }
};
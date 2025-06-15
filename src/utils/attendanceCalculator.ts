
export interface AttendanceCalculation {
  percentage: number;
  recommendation: {
    type: 'can_miss' | 'need_attend';
    classes: number;
    message: string;
  };
}

export const calculateAttendance = (attended: number, total: number): AttendanceCalculation => {
  const percentage = (attended / total) * 100;
  
  if (percentage >= 75) {
    // Calculate how many classes can be missed while staying above 75%
    let canMiss = 0;
    let futureTotal = total;
    
    while (true) {
      futureTotal++;
      const newPercentage = (attended / futureTotal) * 100;
      if (newPercentage < 75) {
        break;
      }
      canMiss++;
    }
    
    return {
      percentage,
      recommendation: {
        type: 'can_miss',
        classes: canMiss,
        message: canMiss > 0 
          ? `You can miss up to ${canMiss} more ${canMiss === 1 ? 'class' : 'classes'} and still maintain 75% attendance.`
          : 'You need to attend all upcoming classes to maintain 75% attendance.'
      }
    };
  } else {
    // Calculate how many consecutive classes need to be attended to reach 75%
    let needToAttend = 0;
    let futureAttended = attended;
    let futureTotal = total;
    
    while (true) {
      futureAttended++;
      futureTotal++;
      needToAttend++;
      
      const newPercentage = (futureAttended / futureTotal) * 100;
      if (newPercentage >= 75) {
        break;
      }
    }
    
    return {
      percentage,
      recommendation: {
        type: 'need_attend',
        classes: needToAttend,
        message: `You need to attend the next ${needToAttend} consecutive ${needToAttend === 1 ? 'class' : 'classes'} to reach 75% attendance.`
      }
    };
  }
};

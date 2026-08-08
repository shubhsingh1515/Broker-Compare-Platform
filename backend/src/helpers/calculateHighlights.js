const calculateHighlights = (brokers) => {
  if (!brokers || brokers.length === 0) return {};

  const highlights = {
    bestOverall: null,
    bestValue: null,
    lowestCharges: null,
    highestRating: null,
    fastestExecution: null,
    bestSupport: null,
    bestPlatform: null
  };

  let maxOverall = -1;
  let maxRating = -1;
  let minDepositVal = Infinity;
  let maxChargesScore = -1;
  let maxSupportScore = -1;
  let maxPlatformScore = -1;
  let maxExecutionScore = -1;

  brokers.forEach(broker => {
    const overall = broker.ratings?.overallScore || broker.overallRating || 0;
    const rating = broker.overallRating || 0;
    const deposit = typeof broker.minDeposit === 'number' ? broker.minDeposit : 0;
    const chargesScore = broker.ratings?.chargesScore || 0;
    const supportScore = broker.ratings?.supportScore || 0;
    const platformScore = broker.ratings?.platformScore || 0;
    const executionScore = broker.ratings?.executionScore || 0;

    if (overall > maxOverall) {
      maxOverall = overall;
      highlights.bestOverall = broker._id.toString();
    }

    if (rating > maxRating) {
      maxRating = rating;
      highlights.highestRating = broker._id.toString();
    }

    if (deposit < minDepositVal) {
      minDepositVal = deposit;
      highlights.bestValue = broker._id.toString();
    }

    if (chargesScore > maxChargesScore) {
      maxChargesScore = chargesScore;
      highlights.lowestCharges = broker._id.toString();
    }

    if (supportScore > maxSupportScore) {
      maxSupportScore = supportScore;
      highlights.bestSupport = broker._id.toString();
    }

    if (platformScore > maxPlatformScore) {
      maxPlatformScore = platformScore;
      highlights.bestPlatform = broker._id.toString();
    }

    if (executionScore > maxExecutionScore) {
      maxExecutionScore = executionScore;
      highlights.fastestExecution = broker._id.toString();
    }
  });

  return highlights;
};

module.exports = calculateHighlights;

const spbSteps = 6;

spbNext = () => {
    let currentStepNum = $('#steppedProgressBar').data('current-step');
    let nextStepNum = (currentStepNum + 1);
    let currentStep = $('.step.step-' + currentStepNum);
    let nextStep = $('.step.step-' + nextStepNum);
    let progressBar = $('#steppedProgressBar');
    if (nextStepNum <= spbSteps) {
        $('#spbSection' + currentStepNum).toggle();
        $('#spbSection' + nextStepNum).toggle();
        $('.steppedProgressBar').removeClass('.step-' + currentStepNum).addClass('.step-' + (currentStepNum + 1));
        currentStep.removeClass('active').addClass('valid');
        currentStep.find('span').addClass('opaque');
        currentStep.find('.fa.fa-check').removeClass('opaque');
        nextStep.addClass('active');
        progressBar.removeAttr('class').addClass('step-' + nextStepNum).data('current-step', nextStepNum);
    } else {
        currentStep.removeClass('active').addClass('valid');
        currentStep.find('.fa.fa-check').removeClass('opaque');
    }
    spbChange();    //ABC: Calls an external function whenever the spb is changed
}

spbPrevious = () => {
    let currentStepNum = $('#steppedProgressBar').data('current-step');
    let prevStepNum = (currentStepNum - 1);
    let currentStep = $('.step.step-' + currentStepNum);
    let prevStep = $('.step.step-' + prevStepNum);
    let progressBar = $('#steppedProgressBar');
    $('#spbSection' + currentStepNum).toggle();
    $('#spbSection' + prevStepNum).toggle();
    $('.steppedProgressBar').removeClass('.step-' + currentStepNum).addClass('.step-' + (prevStepNum));
    currentStep.removeClass('active');
    prevStep.find('span').removeClass('opaque');
    prevStep.find('.fa.fa-check').addClass('opaque');
    prevStep.addClass('active').removeClass('valid');
    progressBar.removeAttr('class').addClass('step-' + prevStepNum).data('current-step', prevStepNum);
    spbChange();    //ABC: Calls an external function whenever the spb is changed
}
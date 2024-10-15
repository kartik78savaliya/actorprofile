import otpGenerator from "otp-generator"

export const getRandomOtp = () => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    })
    return otp;
};

export const getBufferString = (file) => {
    const buffer = file.data;
    return buffer
}

export const getVideoSizeInMB = (file) => {
    const fileSizeInBytes = file.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes.toFixed(2);
  };
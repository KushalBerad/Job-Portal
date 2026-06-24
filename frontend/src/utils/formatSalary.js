export const formatSalary = (salary) => {
    const parsedSalary =
        Number(salary);

    if (
        !parsedSalary ||
        isNaN(parsedSalary)
    ) {
        return "Not disclosed";
    }

    return `${(
        parsedSalary / 100000
    ).toFixed(1)} LPA`;
};
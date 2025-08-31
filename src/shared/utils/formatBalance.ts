export const formatBalance = (balance: string, decimals: number): string => {
    try {
        if (balance == null) {
            return "0.00";
        }

        const num = parseFloat(balance);
        if (!isFinite(num) || num <= 0) {
            return "0.00";
        }

        const divided = num / 10 ** decimals;
        const fixed = divided.toFixed(6);
        const trimmed = fixed
            .replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "")
            .replace(/\.$/, "");
        return trimmed === "0" ? "0.00" : trimmed;
    } catch {
        return "0.00";
    }
};

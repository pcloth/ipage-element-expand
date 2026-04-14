export default function dynamicMask(maskit, masks, tokens) {
    masks = masks.sort((a, b) => a.length - b.length);
    return function (value, mask, masked = true) {
        let i = 0;
        while (i < masks.length) {
            const currentMask = masks[i];
            i++;
            const nextMask = masks[i];
            if (
                !(
                    nextMask &&
                    maskit(value, nextMask, true, tokens).length >
                        currentMask.length
                )
            ) {
                return maskit(value, currentMask, masked, tokens);
            }
        }
        return ""; // empty masks
    };
}

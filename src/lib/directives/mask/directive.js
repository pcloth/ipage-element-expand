import masker from "./masker";
import tokens from "./tokens";

function normalizeConfig(value) {
    if (Array.isArray(value) || typeof value === "string") {
        return {
            mask: value,
            tokens: tokens
        };
    }
    return value;
}

function getInputElement(el) {
    const input = el.tagName === "INPUT" ? el : el.querySelector("input");
    if (!input) {
        throw new Error("v-mask must be used on an input element");
    }
    return input;
}

function emitValue(vnode, value) {
    if (
        vnode &&
        vnode.componentInstance &&
        vnode.componentInstance.$emit
    ) {
        vnode.componentInstance.$emit("input", value);
        return;
    }
    if (
        vnode &&
        vnode.data &&
        vnode.data.model &&
        typeof vnode.data.model.callback === "function"
    ) {
        vnode.data.model.callback(value);
    }
}

export default {
    inserted(el, binding, vnode) {
        const config = normalizeConfig(binding.value);
        const ele = getInputElement(el);
        // 将参数记录到dom上
        ele._config = config;
        let isInputZh = false;
        const onCompositionStart = function () {
            isInputZh = true;
        };
        const onCompositionEnd = function () {
            isInputZh = false;
            onInputHandler();
        };
        const onInput = function () {
            setTimeout(() => {
                onInputHandler();
            }, 0);
        };
        const onBlur = function () {
            setTimeout(() => {
                onInputHandler();
            }, 0);
        };

        ele.addEventListener("compositionstart", onCompositionStart, false);
        ele.addEventListener("compositionend", onCompositionEnd, false);
        ele.oninput = onInput;
        ele.onblur = onBlur;
        ele._maskHandlers = {
            onCompositionStart,
            onCompositionEnd,
            onInput,
            onBlur
        };

        function onInputHandler() {
            if (isInputZh) {
                return;
            }
            let position = ele.selectionEnd;
            // save the character just inserted
            const digit = ele.value[position - 1];
            const _config = ele._config;
            ele.value = masker(ele.value, _config.mask, true, _config.tokens);
            // if the digit was changed, increment position until find the digit again
            while (
                position < ele.value.length &&
                ele.value.charAt(position - 1) !== digit
            ) {
                position++;
            }
            if (ele === document.activeElement) {
                ele.setSelectionRange(position, position);
                setTimeout(function () {
                    ele.setSelectionRange(position, position);
                }, 0);
            }
            emitValue(vnode, ele.value);
        }
    },
    updated(el, binding) {
        const config = normalizeConfig(binding.value);
        const ele = getInputElement(el);
        // 更新参数
        ele._config = config;
    },
    unbind(el) {
        const ele = el.tagName === "INPUT" ? el : el.querySelector("input");
        if (!ele || !ele._maskHandlers) {
            return;
        }
        ele.removeEventListener(
            "compositionstart",
            ele._maskHandlers.onCompositionStart,
            false
        );
        ele.removeEventListener(
            "compositionend",
            ele._maskHandlers.onCompositionEnd,
            false
        );
        ele.oninput = null;
        ele.onblur = null;
        delete ele._maskHandlers;
        delete ele._config;
    }
};

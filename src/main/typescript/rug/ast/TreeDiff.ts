
import { TextTreeNode } from "../tree/PathExpression";

/**
 * Check whether two nodes are structurally equivalent
 */
export function structurallyEquivalent(a: TextTreeNode, b: TextTreeNode): boolean {
    if (a.nodeName() !== b.nodeName()) {
        return false;
    }

    if (a.children().length !== b.children().length) {
        return false;
    }

    if (a.value() === b.value()) {
        return true;
    }

    for (let i = 0; i < a.children().length; i++) {
        const ax = a.children()[i] as TextTreeNode;
        const bx = b.children()[i] as TextTreeNode;
        if (!structurallyEquivalent(ax, bx)) {
            return false;
        }
    }
    return true;
}

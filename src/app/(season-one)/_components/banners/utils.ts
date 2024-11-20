type ActionType = "remove" | "add";

export class AnimationManager {
    private animateRef: React.RefObject<HTMLElement | SVGSVGElement>;
    private currentAnimation: "ENTER" | "EXIT" | "";
    private classNames: { enter: string[]; exit: string[] };

    constructor(
        animateRef: React.RefObject<HTMLElement | SVGSVGElement>,
        classNames: { enter: string[]; exit: string[] }
    ) {
        this.animateRef = animateRef;
        this.classNames = classNames;
        this.currentAnimation = "ENTER";
    }

    private manageClass(action: ActionType, classNames: string[]) {
        classNames.forEach((className) => {
            this.animateRef.current?.classList[action](className);
        });
    }

    handleEnterAnimation() {
        this.currentAnimation = "ENTER";
        this.manageClass("remove", this.classNames.exit);
        this.manageClass("add", this.classNames.enter);
    }

    handleExitAnimation() {
        this.currentAnimation = "EXIT";
        this.manageClass("remove", this.classNames.enter);
        this.manageClass("add", this.classNames.exit);
    }

    initializeAnimation() {
        if (this.currentAnimation === "EXIT") {
            this.handleEnterAnimation();
        } else {
            this.handleExitAnimation();
        }
    }
}

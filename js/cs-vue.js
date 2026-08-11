/* Character-select stage — Vue 3 island
 * Hover effect from Andy Merskin XNMWvQ (parallax depth), layout stays Codex tarot.
 */

(function () {
  const { createApp, ref, onMounted } = Vue;

  const PROFILES = [
    {
      id: "developer",
      cardClass: "cs-card--dev",
      label: "Developer",
      labelPos: "above",
      image: "images/logo/profile1.png",
      numeral: "· I ·",
      sideLeft: "The Developer",
      sideRight: "Code & Craft",
      infoTitle: "Developer",
      infoText: "Code & Craft — typed surfaces, clear systems.",
      ariaLabel: "Select Developer profile",
    },
    {
      id: "artist",
      cardClass: "cs-card--artist",
      label: "Artist",
      labelPos: "below",
      image: "images/logo/profile2.png",
      numeral: "· II ·",
      sideLeft: "The Artist",
      sideRight: "Ink & Illustration",
      infoTitle: "Artist",
      infoText: "Ink & illustration — characters, commissions, craft.",
      ariaLabel: "Select Artist profile",
    },
  ];

  /* Same hover math / handlers as CodePen card component (layout chrome is ours). */
  const DepthCard = {
    name: "DepthCard",
    props: {
      profile: { type: Object, required: true },
      locked: { type: Boolean, default: false },
      reducedMotion: { type: Boolean, default: false },
      isHot: { type: Boolean, default: false },
      isConfirming: { type: Boolean, default: false },
      isUnselected: { type: Boolean, default: false },
    },
    emits: ["select", "focus-side", "clear-focus", "hot", "cold", "hover-sparks"],
    template: `
      <button
        type="button"
        class="cs-card group"
        :class="[
          profile.cardClass,
          { 'is-hot': isHot, 'is-confirming': isConfirming, 'is-unselected': isUnselected }
        ]"
        :data-select-profile="profile.id"
        :data-side="profile.id"
        :aria-label="profile.ariaLabel"
        @pointerenter="onCardEnter"
        @pointerleave="onCardLeave"
        @focus="onCardFocus"
        @blur="onCardBlur"
        @click="$emit('select', profile.id)"
        @keydown="onKeydown"
      >
        <span class="cs-bob">
          <span
            v-if="profile.labelPos === 'above'"
            class="cs-ext-label cs-ext-label--above"
            aria-hidden="true"
          >{{ profile.label }}</span>

          <div
            class="cs-depth"
            ref="card"
            data-cs-wrap
            @mousemove="handleMouseMove"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <div
              class="cs-tarot"
              data-cs-card
              :class="{ 'is-confirm-pulse': isConfirming }"
              :style="cardStyle"
            >
              <div class="cs-frame">
                <div
                  class="cs-card-bg"
                  data-cs-bg
                  :style="[cardBgTransform, cardBgImage]"
                  role="img"
                  :aria-label="profile.label"
                ></div>
                <span class="cs-numeral" aria-hidden="true">{{ profile.numeral }}</span>
                <span class="cs-side-label left" aria-hidden="true">{{ profile.sideLeft }}</span>
                <span class="cs-side-label right" aria-hidden="true">{{ profile.sideRight }}</span>
                <div class="cs-card-info" aria-hidden="true">
                  <h3 class="cs-card-info__title">{{ profile.infoTitle }}</h3>
                  <p class="cs-card-info__text">{{ profile.infoText }}</p>
                </div>
              </div>
            </div>
          </div>

          <span
            v-if="profile.labelPos === 'below'"
            class="cs-ext-label cs-ext-label--below"
            aria-hidden="true"
          >{{ profile.label }}</span>
        </span>
      </button>
    `,
    data: () => ({
      width: 0,
      height: 0,
      mouseX: 0,
      mouseY: 0,
      mouseLeaveDelay: null,
    }),
    computed: {
      mousePX() {
        return this.width ? this.mouseX / this.width : 0;
      },
      mousePY() {
        return this.height ? this.mouseY / this.height : 0;
      },
      cardStyle() {
        if (this.locked) {
          return { transform: "rotateY(0deg) rotateX(0deg)" };
        }
        const rX = this.mousePX * 30;
        const rY = this.mousePY * -30;
        return {
          transform: "rotateY(" + rX + "deg) rotateX(" + rY + "deg)",
        };
      },
      cardBgTransform() {
        if (this.locked) {
          return { transform: "translateX(0px) translateY(0px)" };
        }
        const tX = this.mousePX * -40;
        const tY = this.mousePY * -40;
        return {
          transform: "translateX(" + tX + "px) translateY(" + tY + "px)",
        };
      },
      cardBgImage() {
        return {
          backgroundImage: "url(" + this.profile.image + ")",
        };
      },
    },
    mounted() {
      this.measure();
      window.addEventListener("resize", this.measure);
    },
    beforeUnmount() {
      clearTimeout(this.mouseLeaveDelay);
      window.removeEventListener("resize", this.measure);
    },
    methods: {
      measure() {
        const el = this.$refs.card;
        if (!el) return;
        /* getBoundingClientRect: reliable inside fixed gate (offsetLeft is not) */
        const rect = el.getBoundingClientRect();
        this.width = rect.width || el.offsetWidth || 1;
        this.height = rect.height || el.offsetHeight || 1;
      },
      handleMouseMove(e) {
        if (this.locked || !this.$refs.card) return;
        this.measure();
        const rect = this.$refs.card.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left - this.width / 2;
        this.mouseY = e.clientY - rect.top - this.height / 2;
      },
      handleMouseEnter() {
        clearTimeout(this.mouseLeaveDelay);
        this.measure();
      },
      handleMouseLeave() {
        /* CodePen: wait 1s, then ease mouse back to center (CSS :hover handles glow/info). */
        this.mouseLeaveDelay = setTimeout(() => {
          this.mouseX = 0;
          this.mouseY = 0;
        }, 1000);
      },
      reset() {
        clearTimeout(this.mouseLeaveDelay);
        this.mouseLeaveDelay = null;
        this.mouseX = 0;
        this.mouseY = 0;
      },
      onCardEnter() {
        if (!this.locked) this.$emit("hot", this.profile.id);
        this.$emit("focus-side", this.profile.id);
        if (!this.locked && !this.reducedMotion) {
          this.$emit("hover-sparks", this.profile.id);
        }
      },
      onCardLeave() {
        this.$emit("cold", this.profile.id);
        this.$emit("clear-focus");
      },
      onCardFocus() {
        this.handleMouseEnter();
        this.onCardEnter();
      },
      onCardBlur() {
        this.handleMouseLeave();
        this.onCardLeave();
      },
      onKeydown(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.$emit("select", this.profile.id);
        }
      },
    },
  };

  function createStage(el, hooks) {
    if (!el) return null;

    const api = {
      setLocked() {},
      setConfirming() {},
      setHot() {},
      resetDepth() {},
      getCardEl() {
        return null;
      },
    };

    const app = createApp({
      components: { DepthCard },
      setup() {
        const locked = ref(false);
        const confirming = ref(null);
        const hot = ref(null);
        const reducedMotion = ref(
          typeof hooks.reducedMotion === "function"
            ? hooks.reducedMotion()
            : !!hooks.reducedMotion
        );
        const cardRefs = ref({});

        function setCardRef(id, inst) {
          if (inst) cardRefs.value[id] = inst;
          else delete cardRefs.value[id];
        }

        function setLocked(v) {
          locked.value = !!v;
        }

        function setConfirming(side) {
          confirming.value = side === "developer" || side === "artist" ? side : null;
        }

        function setHot(side) {
          hot.value = side === "developer" || side === "artist" ? side : null;
        }

        function resetDepth() {
          Object.values(cardRefs.value).forEach((c) => c?.reset?.());
        }

        function getCardEl(side) {
          return el.querySelector('[data-select-profile="' + side + '"]');
        }

        api.setLocked = setLocked;
        api.setConfirming = setConfirming;
        api.setHot = setHot;
        api.resetDepth = resetDepth;
        api.getCardEl = getCardEl;

        onMounted(() => {
          hooks.onReady?.(api);
        });

        return {
          profiles: PROFILES,
          locked,
          confirming,
          hot,
          reducedMotion,
          setCardRef,
          onSelect: (id) => hooks.onSelect?.(id),
          onFocusSide: (id) => hooks.onFocusSide?.(id),
          onClearFocus: () => hooks.onClearFocus?.(),
          onHot: (id) => {
            if (!locked.value) setHot(id);
            hooks.onHot?.(id);
          },
          onCold: () => {
            setHot(null);
            hooks.onCold?.();
          },
          onHoverSparks: (id) => hooks.onHoverSparks?.(id, getCardEl(id)),
        };
      },
      template: `
        <DepthCard
          v-for="p in profiles"
          :key="p.id"
          :ref="(inst) => setCardRef(p.id, inst)"
          :profile="p"
          :locked="locked"
          :reduced-motion="reducedMotion"
          :is-hot="hot === p.id"
          :is-confirming="confirming === p.id"
          :is-unselected="!!confirming && confirming !== p.id"
          @select="onSelect"
          @focus-side="onFocusSide"
          @clear-focus="onClearFocus"
          @hot="onHot"
          @cold="onCold"
          @hover-sparks="onHoverSparks"
        />
      `,
    });

    app.mount(el);
    return api;
  }

  window.CsVue = { createStage, PROFILES };
})();

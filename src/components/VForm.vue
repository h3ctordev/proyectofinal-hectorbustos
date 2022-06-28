<template>
  <vue-form :state="formstate" @submit.prevent="onSubmit">
    <b-row align-h="center">
      <b-col cols="12" v-for="field in fields" :key="field.key">
        <validate
          class="form-group"
          :class="fieldClassName(formstate[field.key])"
        >
          <label>
            {{ field.label }}
            <span class="text-danger font-weight-bold" v-if="field.required">
              *
            </span>
          </label>
          <b-form-textarea
            v-if="field.type === 'textarea'"
            v-model.lazy="models[field.key]"
            :value="models[field.key]"
            :disabled="field.disable || false"
            :required="field.required"
            :name="field.key"
            :type="field.type || 'text'"
            class="form-control"
            :min="field.min"
            :max="field.max"
            :passwd="field.passwd"
            :minlength="field.minlength"
            :maxlength="field.maxlength"
            :class="fieldClassName(formstate[field.key])"
          />
          <b-form-select
            v-else-if="field.type === 'selec'"
            v-model.lazy="models[field.key]"
            :value="models[field.key]"
            :disabled="field.disable || false"
            :required="field.required"
            :name="field.key"
            class="form-control"
            :class="fieldClassName(formstate[field.key])"
            :options="field.options"
          ></b-form-select>
          <b-form-input
            v-else
            v-model.lazy="models[field.key]"
            :value="models[field.key]"
            :disabled="field.disable || false"
            :required="field.required"
            :name="field.key"
            :type="field.type || 'text'"
            class="form-control"
            :min="field.min"
            :max="field.max"
            :passwd="field.passwd"
            :minlength="field.minlength"
            :maxlength="field.maxlength"
            :class="fieldClassName(formstate[field.key])"
          />
          <field-messages
            class="form-control-feedback"
            :name="field.name"
            show="$touched || $submitted"
          >
            <!-- <small class="text-success font-weight-bold">
              {{ field.messages.success }}
            </small> -->
            <small class="text-danger font-weight-bold" slot="required">
              {{ field.messages.errors.required }}
            </small>
            <small class="text-danger font-weight-bold" slot="email">
              {{ field.messages.errors.email }}
            </small>
            <small class="text-danger font-weight-bold" slot="minlength">
              {{ field.messages.errors.minlength }}
            </small>
            <small class="text-danger font-weight-bold" slot="min">
              {{ field.messages.errors.min }}
            </small>
            <small class="text-danger font-weight-bold" slot="max">
              {{ field.messages.errors.max }}
            </small>
            <small class="text-danger font-weight-bold" slot="maxlength">
              {{ field.messages.errors.maxlength }}
            </small>
            <small class="text-danger font-weight-bold" slot="passwd">
              {{ field.messages.errors.passwd }}
            </small>
          </field-messages>
        </validate>
      </b-col>
    </b-row>
    <div class="py-2 text-center">
      <b-button
        :class="button.class || ''"
        :variant="button.variant"
        :block="button.block"
        :pill="button.pill"
        type="submit"
      >
        {{ button.label || 'Enviar' }}
      </b-button>
    </div>
  </vue-form>
</template>

<script>
export default {
  name: 'VForm',
  props: {
    fields: {
      type: Array,
      require: true,
    },
    values: {
      type: Object,
      require: true,
    },
    button: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formstate: {},
      models: { ...this.values },
    };
  },
  methods: {
    onSubmit() {
      if (this.formstate.$valid) {
        this.formstate._reset();
        this.$emit('send-form', this.models);
        this.models = { ...this.values };
      }
    },
    fieldClassName(field) {
      if (!field) {
        return null;
      }
      if ((field.$touched || field.$submitted) && field.$valid) {
        return '';
      }
      if ((field.$touched || field.$submitted) && field.$invalid) {
        return 'is-invalid';
      }
    },
  },
};
</script>

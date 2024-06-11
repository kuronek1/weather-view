<template>
  <div class="modal-backdrop" v-if="props.isVisible">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ props.title }}</h3>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <button class="modal-button" @click="confirm">Yes</button>
        <button class="modal-button" @click="cancel">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Confirm",
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => {
  emit("confirm");
};

const cancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-button {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.modal-button:hover {
  background-color: #104e8b;
  transform: scale(1.1);
}
</style>

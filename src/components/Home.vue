<template>
  <h1>Welcome to SCOREBASE Displays</h1>
  <h2>See below a list of pages:</h2>
  <div class="center-container">
    <ul class="custom-list">
      <li>/panel/{panelNumber}</li>
      <li>/ranked</li>
      <li>/latest</li>
      <li>/cis</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HomeComponent",
};
</script>

<style scoped>
.custom-list {
  list-style: none;
  padding: 0;
  margin: 100px;
  text-align: center;
  color: white;
  font-style: bold;
  font-size: 30px;
}

.custom-list li {
  margin-bottom: 20px;
  margin-top: 20px;
}

.header {
  text-align: center;
  margin-bottom: 200px;
  color: white;
}
.header h1 {
  font-size: 50px;
}
.header h2 {
  font-size: 40px;
}
</style>

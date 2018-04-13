<script>
export default {
  name: 'authredirect',
  created () {
    const hash = window.location.search.slice(1)
    window.opener.location.href = `/login#${hash}`
    window.close()
  }
}
</script>

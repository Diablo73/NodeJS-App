git pull origin master

removeTempFileFolder() {
	# if `$1` is a file, delete it
	if [[ -f $1 ]]; then
		rm $1
	fi

	# if `$1` is a directory, delete it
  	if [[ -d $1 ]]; then
		rm -r $1
	fi
}
export -f removeTempFileFolder


echo "START"
echo
# {
# 	nginx -p /home/runner/$REPL_SLUG/ -e logs/nginx.log -c resources/nginx/nginx.conf -g 'daemon off;'
# } &
{
	removeTempFileFolder package.json &&
 	removeTempFileFolder package-lock.json &&
	removeTempFileFolder node_modules
} &&
{
	{
		cd backend/ && npm run start
	} & 
	{
		cd frontend/ && npm run start
	}
}
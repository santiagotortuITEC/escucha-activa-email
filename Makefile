project=escucha-activa
app_name=email
app_version=1.0

build:
	@docker build --no-cache --tag $(project)/$(app_name):$(app_version) --tag $(project)/$(app_name):latest .
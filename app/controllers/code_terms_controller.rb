class CodeTermsController < ApplicationController
  # GET /code_terms
  # GET /code_terms.xml
  def index
    @code_terms = CodeTerm.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @code_terms }
    end
  end

  # GET /code_terms/1
  # GET /code_terms/1.xml
  def show
    @code_term = CodeTerm.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @code_term }
    end
  end

  # GET /code_terms/new
  # GET /code_terms/new.xml
  def new
    @code_term = CodeTerm.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @code_term }
    end
  end

  # GET /code_terms/1/edit
  def edit
    @code_term = CodeTerm.find(params[:id])
  end

  # POST /code_terms
  # POST /code_terms.xml
  def create
    @code_term = CodeTerm.new(params[:code_term])

    respond_to do |format|
      if @code_term.save
        format.html { redirect_to(@code_term, :notice => 'Code term was successfully created.') }
        format.xml  { render :xml => @code_term, :status => :created, :location => @code_term }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @code_term.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /code_terms/1
  # PUT /code_terms/1.xml
  def update
    @code_term = CodeTerm.find(params[:id])

    respond_to do |format|
      if @code_term.update_attributes(params[:code_term])
        format.html { redirect_to(@code_term, :notice => 'Code term was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @code_term.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /code_terms/1
  # DELETE /code_terms/1.xml
  def destroy
    @code_term = CodeTerm.find(params[:id])
    @code_term.destroy

    respond_to do |format|
      format.html { redirect_to(code_terms_url) }
      format.xml  { head :ok }
    end
  end
end
